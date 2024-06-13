import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, Typography, List, ListItem, ListItemText } from '@mui/material';
import { logout } from '../redux/authSlice';
import api from '../board/axiosInstance';
import { useNavigate } from 'react-router-dom';

function ProfileModal({ open, onClose }) {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!user) {
            onClose();
        }
    }, [user, onClose]);

    return (
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLogout} color="secondary">로그아웃</Button>
                <Button onClick={onClose} color="primary">닫기</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProfileModal;
