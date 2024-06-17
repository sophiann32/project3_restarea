const dbConfig = require('../db/dbConfig');
const oracledb = require('oracledb');

const recommendPost = async (req, res) => {
    const { POST_ID, USER_ID } = req.body;
    try {
        const connection = await dbConfig.getConnection();

        // 이미 추천한 사용자인지 확인
        const recommendationResult = await connection.execute(
            'SELECT * FROM recommendations WHERE POST_ID = :POST_ID AND USER_ID = :USER_ID',
            { POST_ID, USER_ID }
        );

        if (recommendationResult.rows.length > 0) {
            await connection.close();
            return res.status(400).json({ error: '이미 추천하셨습니다.' });
        }

        // 추천 추가
        await connection.execute(
            `INSERT INTO recommendations (POST_ID, USER_ID)
             VALUES (:POST_ID, :USER_ID)`,
            { POST_ID, USER_ID },
            { autoCommit: true }
        );

        // 추천 수 업데이트
        const countResult = await connection.execute(
            'SELECT COUNT(*) FROM recommendations WHERE POST_ID = :POST_ID',
            { POST_ID }
        );

        const recommendationCount = countResult.rows[0][0];

        await connection.close();
        res.status(201).json({ message: '추천 완료', recommendationCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '추천 실패' });
    }
};


module.exports = { recommendPost };
