const express = require('express');
const oracledb = require('oracledb');
const multer = require('multer');
const dbConfig = require('../db/dbConfig'); // 경로를 맞게 설정하세요
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
require('dotenv').config();

// 유저 프로필 사진 업로드 엔드포인트
router.post('/upload-profile-picture', upload.single('profile_picture'), async (req, res) => {
    const { user_id } = req.body;
    const profilePicture = req.file.buffer;
    let connection;

    try {
        connection = await dbConfig.getConnection();
        await connection.execute(
            `INSERT INTO user_profile (user_id, profile_picture)
             VALUES (:user_id, :profile_picture)`,
            { user_id, profile_picture: profilePicture },
            { autoCommit: true }
        );
        res.status(201).json({ message: '프로필 사진 업로드 성공' });
    } catch (err) {
        console.error("업로드 중 에러 발생", err);
        res.status(500).json({ message: '서버 에러' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("연결 종료 중 에러 발생", err);
            }
        }
    }
});

module.exports = router; // 라우터 모듈 내보내기
