const dbConfig = require('../db/dbConfig');
const oracledb = require('oracledb');

// convertClobToString 함수 정의
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

const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const connection = await dbConfig.getConnection();
        const result = await connection.execute(
            `SELECT c.COMMENT_ID, c.POST_ID, c.USER_ID, c.CONTENT, c.CREATED_AT, c.UPDATED_AT, u.USERNAME
             FROM comments c
                      JOIN users u ON c.USER_ID = u.USER_ID
             WHERE c.POST_ID = :postId`,
            [postId]
        );

        const comments = await Promise.all(result.rows.map(async (row) => {
            const content = await convertClobToString(row[3]);
            return {
                COMMENT_ID: row[0],
                POST_ID: row[1],
                USER_ID: row[2],
                CONTENT: content,
                CREATED_AT: row[4],
                UPDATED_AT: row[5],
                USERNAME: row[6]
            };
        }));

        await connection.close();
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '댓글 가져오기 실패' });
    }
};

const createComment = async (req, res) => {
    const { POST_ID, USER_ID, CONTENT } = req.body;
    try {
        const connection = await dbConfig.getConnection();
        await connection.execute(
            `INSERT INTO comments (POST_ID, USER_ID, CONTENT)
             VALUES (:POST_ID, :USER_ID, :CONTENT)`,
            { POST_ID, USER_ID, CONTENT },
            { autoCommit: true }
        );

        await connection.close();
        res.status(201).send('댓글 작성 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '댓글 작성 실패' });
    }
};

const updateComment = async (req, res) => {
    const { id } = req.params;
    const { CONTENT } = req.body;
    try {
        const connection = await dbConfig.getConnection();
        await connection.execute(
            `UPDATE comments SET CONTENT = :CONTENT, UPDATED_AT = CURRENT_TIMESTAMP WHERE COMMENT_ID = :id`,
            [CONTENT, id],
            { autoCommit: true }
        );

        await connection.close();
        res.send('댓글 수정 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '댓글 수정 실패' });
    }
};

const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await dbConfig.getConnection();
        await connection.execute(`DELETE FROM comments WHERE COMMENT_ID = :id`, [id], { autoCommit: true });

        await connection.close();
        res.send('댓글 삭제 완료');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '댓글 삭제 실패' });
    }
};

module.exports = { getCommentsByPostId, createComment, updateComment, deleteComment };
