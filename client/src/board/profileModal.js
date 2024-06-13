import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, Typography, List, ListItem, ListItemText, TextField } from '@mui/material';
import { logout, setUser } from '../redux/authSlice'; // 사용자 상태 업데이트를 위해 setUser 액션을 가져옵니다.
import api from '../board/axiosInstance';
import { useNavigate } from 'react-router-dom';

function ProfileModal({ open, onClose }) {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

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

                // 서버에서 업로드된 이미지를 받아서 상태를 업데이트합니다.
                const updatedUser = { ...user, profilePicture: URL.createObjectURL(file) };
                console.log('Updated user:', updatedUser);
                dispatch(setUser(updatedUser));
            }
        } catch (error) {
            console.error('프로필 사진 업로드 실패', error);
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleUploadClick = () => {
        setConfirmOpen(true);
    };

    useEffect(() => {
        if (!user) {
            onClose();
        }
    }, [user, onClose]);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    프로필
                    <Button
                        aria-label="close"
                        onClick={onClose}
                        style={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
                    >
                        X
                    </Button>
                </DialogTitle>
                <DialogContent dividers>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Avatar alt={user?.username} src={user?.profilePicture || '/img/default-profile.png'} style={{ width: 100, height: 100 }} />
                        <Typography variant="h6" style={{ marginTop: 16 }}>{user?.username}</Typography>
                        <Typography variant="body2" color="textSecondary">{`가입일자: ${new Date(user?.createdAt).toLocaleDateString()}`}</Typography>
                    </div>
                    <List>
                        <ListItem>
                            <ListItemText primary="게시글 내역" secondary="게시글 내역 내용" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="댓글 내역" secondary="댓글 내역 내용" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="추천 내역" secondary="추천 내역 내용" />
                        </ListItem>
                    </List>
                    <TextField type="file" onChange={handleFileChange} />
                    <Button onClick={handleUploadClick} color="primary">사진 업로드</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogout} color="secondary">로그아웃</Button>
                    <Button onClick={onClose} color="primary">닫기</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>사진 업로드 확인</DialogTitle>
                <DialogContent>사진을 업로드하시겠습니까?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="primary">취소</Button>
                    <Button onClick={handleUpload} color="primary">확인</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ProfileModal;
