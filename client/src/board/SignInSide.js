import * as React from 'react';
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
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        try {
            const response = await api.post('/login', { email, password });
            if (response.status === 200) {
                const { accessToken, refreshToken, user } = response.data;
                dispatch(loginSuccess({ accessToken, refreshToken, user }));
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                navigate('/');
                closeDrawer(); // 로그인 성공 시 Drawer를 닫음
            } else {
                console.error('Login failed with status:', response.status);
            }
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

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
                        padding: 4,
                    }}
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 6,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
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
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
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
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
