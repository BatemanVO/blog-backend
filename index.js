require('dotenv').config();
const mongoose = require('mongoose');
const app = require('express')();
const { Post } = require('./models/post.js');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT));

app.get('/posts', (request, response) => {
    Post.find({}).then(posts => response.json(posts));
});
