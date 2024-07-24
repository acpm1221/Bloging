const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/auth', authRoute);
app.use('/posts', postsRoute);
app.use('/comments', commentsRoute);

module.exports = app;
