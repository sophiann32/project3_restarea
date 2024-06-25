import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from '../board/axiosInstance';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice'; // loginSuccess 액션 import
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignInSide({ setIsLogin, setUser, closeDrawer }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            if (response.status === 200) {
                const { accessToken, refreshToken, user } = response.data;
                dispatch(loginSuccess({ accessToken, refreshToken, user }));
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                console.log("로그인 성공 , user:" ,user) // 디버깅용 콘솔
                setUser(user)
                setIsLogin(true)
                navigate('/');
                closeDrawer(); // 로그인 성공 시 Drawer를 닫음
            } else {
                console.error('Login failed with status:', response.status);
            }
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleRememberMe = (event) => {
        const checked = event.target.checked;
        setRememberMe(checked);
    };

    useEffect(() => {
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    }, [rememberMe, email]);

    const goToSignUp = () => {
        navigate('/SignUp');
        closeDrawer(); // 회원가입 페이지로 이동 시 Drawer를 닫음
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={12}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 1,
                    }}
                >
                    <Box
                        sx={{
                            my: 2,
                            mx: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '80%',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, mx:4 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={rememberMe} onChange={handleRememberMe} color="primary" />}
                                label="아이디 저장"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 1 }}
                            >
                                로그인
                            </Button>
                            <Button
                                onClick={goToSignUp}
                                fullWidth
                                variant="contained"
                            >
                                회원가입
                            </Button>
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 2,
                                    mt: 3,
                                }}
                            >
                                <Button
                                    onClick={closeDrawer}
                                    variant="contained"
                                    sx={{
                                        bgcolor: 'red',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'darkred',
                                        },
                                    }}
                                >
                                    닫기
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
