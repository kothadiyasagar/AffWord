const Post = require('../models/postModel');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);

    const post = await Post.create({
      caption,
      imageUrl: result.secure_url,
      user: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name');
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createPost, getPosts }; 