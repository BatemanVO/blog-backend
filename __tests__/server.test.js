const { Post } = require('../models/post.js');
const request = require('supertest');
const app = require('../app.js');
const mongoose = require('mongoose');

describe('Server routes', () => {
    beforeEach(done => Post.deleteMany({}, done));
    afterAll(() => mongoose.disconnect());

    const EXPECTED_POST = { title: 'Some title', body: 'Some body' };
    describe('GET', () => {
        it('Should return all posts in the database', done => {
            new Post(EXPECTED_POST).save().then(() => request(app).get('/')).then(response => {
                expect(response.status).toBe(200);
                expect(response.body.length).toBe(1);
                const post = response.body[0];
                expect(post.title).toBe(EXPECTED_POST.title);
                expect(post.body).toBe(EXPECTED_POST.body);
                done();
            });
        });
    });

    describe('POST', () => {
        describe('With no errors', () => {
            it('Should return a 200 status code and insert the Post into the database', done => {
                request(app)
                    .post('/')
                    .send(EXPECTED_POST)
                    .then(response => {
                        expect(response.status).toBe(200);
                        return Post.find({});
                    }).then(posts => {
                        expect(posts.length).toBe(1);
                        const post = posts[0];
                        expect(post.title).toBe(EXPECTED_POST.title);
                        expect(post.body).toBe(EXPECTED_POST.body);
                        done();
                    });
            });
        });

        describe('With an error', () => {
            it('Should return a 500 status code and not insert anything into the database', done => {
                request(app)
                    .post('/')
                    .then(response => {
                        expect(response.status).toBe(500);
                        return Post.find({});
                    }).then(posts => {
                        expect(posts.length).toBe(0);
                        done();
                    });
            });
        });
    });

    describe('PUT', () => {
        describe('With no errors', () => {
            describe('With a title not matching one in the database', () => {
                it('Should return a 200 status code and insert the Post into the database', done => {
                    request(app)
                        .put('/')
                        .send(EXPECTED_POST)
                        .then(response => {
                            expect(response.status).toBe(200);
                            return Post.find({});
                        }).then(posts => {
                            expect(posts.length).toBe(1);
                            const post = posts[0];
                            expect(post.title).toBe(EXPECTED_POST.title);
                            expect(post.body).toBe(EXPECTED_POST.body);
                            done();
                        });
                });
            });

            describe('With a title matching one in the database', () => {
                it('Should return a 200 status code and insert the Post into the database', done => {
                    const EXPECTED_BODY = EXPECTED_POST.body + ' some changes';
                    new Post(EXPECTED_POST).save()
                        .then(() => request(app)
                            .put('/')
                            .send({
                                originalTitle: EXPECTED_POST.title,
                                title: EXPECTED_POST.title,
                                body: EXPECTED_BODY
                            })
                        )
                        .then(response => {
                            expect(response.status).toBe(200);
                            return Post.find({});
                        }).then(posts => {
                            expect(posts.length).toBe(1);
                            const post = posts[0];
                            expect(post.title).toBe(EXPECTED_POST.title);
                            expect(post.body).toBe(EXPECTED_BODY);
                            done();
                        });
                });
            });
        });

        describe('With no title passed in the request body', () => {
            it('Should return a 500 status and not insert anything into the database', done => {
                request(app)
                    .put('/')
                    .then(response => {
                        expect(response.status).toBe(500);
                        return Post.find({});
                    }).then(posts => {
                        expect(posts.length).toBe(0);
                        done();
                    });
            });
        });
    });

    describe('DELETE', () => {
        describe('With a title provided and a Post existing with that title', () => {
            it('Should delete the record with the matching title out of the database', done => {
                new Post(EXPECTED_POST).save()
                    .then(() => request(app)
                        .delete('/')
                        .send({ title: EXPECTED_POST.title })
                    )
                    .then(response => {
                        expect(response.status).toBe(200);
                        return Post.find({});
                    }).then(posts => {
                        expect(posts.length).toBe(0);
                        done();
                    });
            });
        });

        describe('With no title provided', () => {
            it('Should return a 500 status code', done => {
                new Post(EXPECTED_POST).save()
                    .then(() => request(app)
                        .delete('/')
                        .send()
                    )
                    .then(response => {
                        expect(response.status).toBe(500);
                        return Post.find({});
                    }).then(posts => {
                        expect(posts.length).toBe(1);
                        done();
                    });
            });
        });
    });

    describe('To an endpoint that does not exist', () => {
        it('Should return a 404 status', done => {
            request(app).get('/some-non-existent-endpoint')
                .then(response => {
                    expect(response.status).toBe(404);
                    done();
                });
        });
    });

    describe('With an unrecognized host', () => {
        it('Should return a 401 status', done => {
            request(app)
                .get('/')
                .set('Host', 'www.example.com')
                .then(response => {
                    expect(response.status).toBe(401);
                    done();
                });
        });
    });
});
