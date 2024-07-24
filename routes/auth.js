const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SignUp
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist) return res.status(400).send('Email already exists');

  const user = new User({ email, password });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Email or password is wrong');

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  const token = jwt.sign({ _id: user._id }, 'secret');
  res.header('Authorization', token).send({ token });
});

// Logout (Invalidate JWT)
router.post('/logout', (req, res) => {
  res.header('Authorization', '').send('Logged out successfully');
});

module.exports = router;
