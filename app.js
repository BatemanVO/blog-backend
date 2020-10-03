require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = require('express')();
const { Post } = require('./models/post.js');
const ORIGINS = process.env.ORIGINS.split(' ');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());
app.use((request, response, next) => ORIGINS.includes(request.hostname) ? next() : response.status(401).end());

app.get('/', (request, response) => {
    Post.find({}).then(posts => response.status(200).json(posts));
});

app.post('/', (request, response) => {
    new Post(request.body).save()
        .then(() => response.status(200).send('Post successfully created'))
        .catch(err => response.status(500)
            .send(`The following error was encountered while trying to create a post: ${err.message}`)
        );
});

app.put('/', (request, response) => {
    if (!request.body.title) {
        response.status(500).send('Missing required field "title"');
        return;
    }
    Post.findOneAndUpdate({ title: request.body.originalTitle }, request.body, { upsert: true }, () => {
        response.status(200).send('Post successfully updated');
    });
});

app.delete('/', (request, response) => {
    if (!request.body.title) {
        response.status(500).send('A title is required to delete a Post');
        return;
    }
    Post.findOneAndDelete(
        { title: request.body.title },
        () => response.status(200).send('All posts with that title successfully deleted')
    );
});

app.use((request, response) => {
    response.status(404).send('Endpoint not found');
});

module.exports = app;
