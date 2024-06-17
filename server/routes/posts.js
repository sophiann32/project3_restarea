const express = require('express');
const router = express.Router();
const { getPosts, createPost, updatePost, deletePost, getPostById } = require('../controller/postsController');
const { getCommentsByPostId, createComment, updateComment, deleteComment } = require('../controller/commentsController');
const { recommendPost } = require('../controller/recommendationsController');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// CRUD 라우터
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', upload.array('images'), createPost); // 여러 이미지 업로드
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

router.get('/posts/:postId/comments', getCommentsByPostId);
router.post('/comments', createComment);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);

router.post('/recommendations', recommendPost);


module.exports = router;
