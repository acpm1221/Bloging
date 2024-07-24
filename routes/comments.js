const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const auth = require('../middleware/auth');

// Create a new comment
router.post('/:postId', auth, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).send('Post not found');

  const comment = new Comment({
    content: req.body.content,
    post: req.params.postId,
    author: req.user._id
  });

  try {
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update a comment by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { content: req.body.content },
      { new: true }
    );
    if (!updatedComment) return res.status(404).send('Comment not found');
    res.json(updatedComment);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a comment by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedComment = await Comment.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!deletedComment) return res.status(404).send('Comment not found');
    res.send('Comment deleted');
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
