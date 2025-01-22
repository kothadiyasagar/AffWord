const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { createPost, getPosts } = require('../controllers/postController');

const upload = multer({ dest: 'uploads/' });

router.route('/')
  .post(protect, upload.single('image'), createPost)
  .get(protect, getPosts);

module.exports = router; 