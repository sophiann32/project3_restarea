const oracledb = require('oracledb');
const multer = require('multer'); // 이미지 업로드할때 필요한 모듈
const express = require('express');
const router = express.Router();
const dbConfig = require('../db/dbConfig');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
require('dotenv').config();

//유저 프로필 사진 업로드 엔드포인트

router.post('/upload-profile-picture', upload.single('profile_picture'), async (req, res) => {
    const {user_id} = req.body;
    const profilePicture = req.file.buffer;
    let connction;

    try {
        connction = await dbConfig.getConnections();
        await connction.execute(
            `INSERT INTO user_profile (user_id, profile_picture)
             VALUES (:user_id, :profile_picture)`,
            {user_id, profile_picture: profilePicture},
            {autoCommit: true}
        );
        res.status(201).json({message: '프로필 사진 업로드 성공'});
    } catch (err) {
        console.error("업로드 하는중 에러 발생 ", err);
        res.status(500).json({message: '서버 에러 '});
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("연결 끊는데 에러 발생", err)
            }
        }

    }

});

module.exports = router;

