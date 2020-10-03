const { Post } = require('../models/post.js');
const request = require('supertest');
const app = require('../app.js');
const mongoose = require('mongoose');

describe('Server routes', () => {
    beforeEach(done => Post.deleteMany({}, done));
    afterAll(() => mongoose.disconnect());

    describe('GET', () => {
        it('Should return all posts in the database', done => {
            const EXPECTED_POST = { title: 'Some title', body: 'Some body' };
            new Post(EXPECTED_POST).save().then(() => request(app).get('/')).then(response => {
                expect(response.status).toBe(200);
                done();
            });
        });
    });
});
