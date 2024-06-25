import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Avatar, Typography, TextField, Button, CssBaseline, Paper, Box, Grid, List, ListItem, ListItemText } from '@mui/material';
import { logout, setUser } from '../redux/authSlice';
import api from '../board/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

function ProfileModal({ open,  onClose }) {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            dispatch(logout());
            navigate('/');
            onClose();
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log('Selected file:', selectedFile);
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', file);
        formData.append('user_id', user.id);

        try {
            const response = await api.post('/api/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                console.log('프로필 사진 업로드 성공');
                console.log('Uploaded file:', file);

                // 서버에서 반환된 프로필 사진 URL 설정
                const updatedUser = { ...user, profilePicture: URL.createObjectURL(file) };
                console.log('Updated user:', updatedUser);
                dispatch(setUser(updatedUser));
            }
        } catch (error) {
            console.error('프로필 사진 업로드 실패', error);
        } finally {
            onClose(); // 업로드 후 모달 닫기
        }
    };

    const close = () => {
        navigate('/main');
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Drawer anchor="right" open={open} onClose={onClose}>
                <CssBaseline />
                <Grid container component="main" sx={{ height: '100vh', width: 400 }}>
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
                                mx: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar alt={user?.username} src={user?.profilePicture || '/img/default-profile.png'} sx={{ width: 100, height: 100 }} />
                            <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
                                {user?.username}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                                가입일자: {new Date(user?.createdAt).toLocaleDateString()}
                            </Typography>
                            <List sx={{ width: '100%' }}>
                                <ListItem>
                                    <ListItemText primary="게시글 내역" secondary="현재 게시글이 없습니다." />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="댓글 내역" secondary="현재 댓글이 없습니다." />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="추천 내역" secondary="현재 추천한 게시글이 없습니다." />
                                </ListItem>
                            </List>
                            <Box component="form" noValidate sx={{ mt: 1 }}>
                                <TextField
                                    type="file"
                                    onChange={handleFileChange}
                                    fullWidth
                                />
                                <Button
                                    onClick={handleUpload}
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    프로필 사진 변경
                                </Button>
                            </Box>
                            <Button
                                onClick={handleLogout}
                                fullWidth
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 1, mb: 1 }}
                            >
                                로그아웃
                            </Button>
                        </Box>
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
                                onClick={close}
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
                    </Grid>
                </Grid>
            </Drawer>
        </ThemeProvider>
    );
}

export default ProfileModal;
