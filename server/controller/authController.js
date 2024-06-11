const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const dbConfig = require('../db/dbConfig');
require('dotenv').config();

const login = async (req, res) => {
    const { email, password } = req.body;
    let connection;

    try {
        connection = await dbConfig.getConnection();

        const result = await connection.execute(
            `SELECT USER_ID, USERNAME, EMAIL, PASSWORD FROM users WHERE email = :email`,
            [email]
        );

        if (result.rows.length > 0) {
            const userInfo = result.rows[0];
            const dbPassword = userInfo[3]; // 데이터베이스에서 가져온 평문 비밀번호

            if (password === dbPassword) { // 평문 비밀번호 비교
                const accessToken = jwt.sign({
                    id: userInfo[0], // USER_ID
                    username: userInfo[1], // USERNAME
                    email: userInfo[2] // EMAIL
                }, process.env.ACCESS_SECRET, {
                    expiresIn: '1m',
                    issuer: 'UHB'
                });

                const refreshToken = jwt.sign({
                    id: userInfo[0], // USER_ID
                    username: userInfo[1], // USERNAME
                    email: userInfo[2] // EMAIL
                }, process.env.REFRESH_SECRET, {
                    expiresIn: '7d',
                    issuer: 'UHB'
                });
                console.log("access token", accessToken);
                console.log("refresh token", refreshToken);

                res.cookie('accessToken', accessToken, {
                    secure: false, // production 환경에서는 true로 설정
                    httpOnly: true,
                    // sameSite: 'Lax' // 필요에 따라 'Strict', 'None'으로 변경
                });


                res.cookie('refreshToken', refreshToken, {
                    secure: false, // production 환경에서는 true로 설정
                    httpOnly: true,
                    // sameSite: 'Lax' // 필요에 따라 'Strict', 'None'으로 변경
                });

                console.log("Set-Cookie Header Sent for Access Token:", accessToken);
                console.log("Set-Cookie Header Sent for Refresh Token:", refreshToken);

                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const data = jwt.verify(token, process.env.REFRESH_SECRET);

        const accessToken = jwt.sign({
            id: data.id,
            username: data.username,
            email: data.email
        }, process.env.ACCESS_SECRET, {
            expiresIn: '1m',
            issuer: 'UHB'
        });

        res.cookie('accessToken', accessToken, {
            secure: false,
            httpOnly: true
        });

        res.status(200).json({ message: 'Access Token Recreated' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logout = (req, res) => {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
    login,
    refreshToken,
    logout
};
