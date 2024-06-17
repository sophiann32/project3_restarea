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

        // 프로필 사진 업데이트
        await connection.execute(
            `UPDATE user_profile SET profile_picture = :profile_picture WHERE user_id = :user_id`,
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

// 프로필 이미지 반환 엔드포인트
router.get('/profile-picture/:user_id', async (req, res) => {
    const { user_id } = req.params;
    let connection;

    try {
        connection = await dbConfig.getConnection();
        const result = await connection.execute(
            `SELECT profile_picture FROM user_profile WHERE user_id = :user_id`,
            { user_id }
        );

        if (result.rows.length > 0) {
            const profilePicture = result.rows[0][0];
            if (profilePicture) {
                const base64Image = Buffer.from(profilePicture).toString('base64');
                const imgSrcString = `data:image/jpeg;base64,${base64Image}`;
                res.status(200).json({ profilePicture: imgSrcString });
            } else {
                res.status(404).json({ message: 'Profile picture not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error("프로필 사진 불러오기 중 에러 발생", err);
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
