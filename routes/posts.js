const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email');
    res.json(posts);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'email');
    res.json(post);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update a post by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!updatedPost) return res.status(404).send('Post not found');
    res.json(updatedPost);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a post by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!deletedPost) return res.status(404).send('Post not found');
    res.send('Post deleted');
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
