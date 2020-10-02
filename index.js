require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = require('express')();
const { Post } = require('./models/post.js');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', true);

app.use(bodyParser.json());

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
    Post.findOneAndUpdate({ title: request.body.originalTitle }, request.body, { upsert: true }, (err) => {
        if (err) {
            response.status(500).send(`The following error was encountered while trying to update a post: ${err.message}`);
        } else {
            response.status(200).send('Post successfully updated');
        }
    });
});

app.delete('/', (request, response) => {
    Post.findOneAndDelete({ title: request.body.originalTitle }, (err) => {
        if (err) {
            response.status(500).send(`The following error was encountered while trying to delete a post: ${err.message}`);
        } else {
            response.status(200).send('Post successfully deleted');
        }
    });
});

app.use((request, response) => {
    response.status(404).send('Endpoint not found');
});
