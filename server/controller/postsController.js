const dbConfig = require('../db/dbConfig');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const oracledb = require('oracledb');


const convertClobToString = async (clob) => {
    return new Promise((resolve, reject) => {
        let clobData = '';
        clob.setEncoding('utf8');
        clob.on('data', (chunk) => {
            clobData += chunk;
        });
        clob.on('end', () => {
            resolve(clobData);
        });
        clob.on('error', (err) => {
            reject(err);
        });
    });
};
const getPosts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const endRow = offset + limit;

    try {
        const connection = await dbConfig.getConnection();
        const result = await connection.execute(`
            SELECT * FROM (
                              SELECT p.POST_ID, p.USER_ID, p.TITLE, p.CONTENT, p.CREATED_AT, p.UPDATED_AT, u.USERNAME, ROWNUM r
                              FROM posts p
                                       JOIN users u ON p.USER_ID = u.USER_ID
                              WHERE ROWNUM <= :endRow
                              ORDER BY p.CREATED_AT DESC
                          )
            WHERE r > :offset
        `, { endRow, offset });

        const rows = result.rows;

        const posts = await Promise.all(rows.map(async (row) => {
            const content = await convertClobToString(row[3]);
            const imagesResult = await connection.execute(
                'SELECT IMAGE FROM post_images WHERE POST_ID = :POST_ID',
                [row[0]]
            );
            const images = imagesResult.rows.map(imageRow => ({
                data: Buffer.from(imageRow[0]).toString('base64'), // 버퍼 데이터를 base64 문자열로 변환
                mimeType: 'image/jpeg' // 하드코딩된 MIME 타입 설정
            }));
            return {
                POST_ID: row[0],
                USER_ID: row[1],
                TITLE: row[2],
                CONTENT: content,
                CREATED_AT: row[4],
                UPDATED_AT: row[5],
                USERNAME: row[6],
                IMAGES: images
            };
        }));

        await connection.close();
        console.log('서버에서 반환된 데이터:', posts); // 데이터 확인
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '게시물 가져오기 실패' });
    }
};


const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await dbConfig.getConnection();
        const result = await connection.execute(`
            SELECT p.POST_ID, p.USER_ID, p.TITLE, p.CONTENT, p.CREATED_AT, p.UPDATED_AT, u.USERNAME
            FROM posts p
            JOIN users u ON p.USER_ID = u.USER_ID
            WHERE p.POST_ID = :id
        `, [id]);
        const rows = result.rows;

        if (rows.length === 0) {
            await connection.close();
            return res.status(404).json({ error: '글을 찾을 수 없음' });
        }

        const content = await convertClobToString(rows[0][3]);
        const post = {
            POST_ID: rows[0][0],
            USER_ID: rows[0][1],
            TITLE: rows[0][2],
            CONTENT: content,
            CREATED_AT: rows[0][4],
            UPDATED_AT: rows[0][5],
            USERNAME: rows[0][6]  // 작성자 이름 추가
        };

        await connection.close();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '실패' });
    }
};


const createPost = async (req, res) => {
    const { USER_ID, TITLE, CONTENT } = req.body;
    const images = req.files;

    console.log('Received data:', req.body);
    console.log('Received files:', req.files);

    const userId = parseInt(USER_ID, 10);
    console.log('Parsed USER_ID:', userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid USER_ID' });
    }

    try {
        const connection = await dbConfig.getConnection();
        let result = await connection.execute(
            `INSERT INTO posts (USER_ID, TITLE, CONTENT)
             VALUES (:USER_ID, :TITLE, :CONTENT)
                 RETURNING POST_ID INTO :postId`,
            { USER_ID: userId, TITLE, CONTENT, postId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
            { autoCommit: true }
        );

        const postId = result.outBinds.postId[0];
        console.log('Created post with POST_ID:', postId);

        if (images && images.length > 0) {
            for (const image of images) {
                await connection.execute(
                    'INSERT INTO post_images (POST_ID, IMAGE) VALUES (:POST_ID, :IMAGE)',
                    { POST_ID: postId, IMAGE: image.buffer },
                    { autoCommit: true }
                );
            }
        }

        await connection.close();
        res.status(201).send('글 작성 완료');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: '글 작성 실패' });
    }
};
const deletePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // 미들웨어를 통해 설정된 사용자 ID

    try {
        const connection = await dbConfig.getConnection();

        // 작성자인지 확인
        const postResult = await connection.execute(
            'SELECT USER_ID FROM posts WHERE POST_ID = :id',
            [id]
        );

        if (postResult.rows.length === 0) {
            await connection.close();
            return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
        }

        if (postResult.rows[0][0] !== userId) {
            await connection.close();
            return res.status(403).json({ error: '권한이 없습니다.' });
        }

        // 댓글 삭제
        await connection.execute('DELETE FROM comments WHERE POST_ID = :id', [id], { autoCommit: true });

        // 게시글 삭제
        await connection.execute('DELETE FROM posts WHERE POST_ID = :id', [id], { autoCommit: true });

        await connection.close();
        res.send('글 삭제 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '글 삭제 실패' });
    }
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { TITLE, CONTENT } = req.body;
    const userId = req.userId; // 미들웨어를 통해 설정된 사용자 ID

    try {
        const connection = await dbConfig.getConnection();

        // 작성자인지 확인
        const postResult = await connection.execute(
            'SELECT USER_ID FROM posts WHERE POST_ID = :id',
            [id]
        );

        if (postResult.rows.length === 0 || postResult.rows[0][0] !== userId) {
            await connection.close();
            return res.status(403).json({ error: '권한이 없습니다.' });
        }

        await connection.execute(
            'UPDATE posts SET TITLE = :TITLE, CONTENT = :CONTENT, UPDATED_AT = CURRENT_TIMESTAMP WHERE POST_ID = :id',
            [TITLE, CONTENT, id],
            { autoCommit: true }
        );

        await connection.close();
        res.send('글 수정 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '글 수정 실패' });
    }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };

