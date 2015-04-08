var should = require('chai').should(),
    expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest('http://localhost:8080');

describe('Auth', function() {
    it('should not be able to create a user with a duplicate username', function(done) {
        api.post('/api/signup')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                username: 'angel', // existing username
                password: 'testpassword'
            })
            .expect(409)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('A user with that username already exists.');
                done();
            });
    });

    it('should not be able to authenticate with a nonexistent user', function(done) {
        api.post('/api/authenticate')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                username: 'tom1', // nonexistent username
                password: 'testpassword'
            })
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Authentication failed: user not found.');
                done();
            });
    });

    it('should not be able to authenticate with a wrong password', function(done) {
        api.post('/api/authenticate')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                username: 'angel',
                password: 'secret1' // wrong password for 'angel'
            })
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Authentication failed: wrong password.');
                done();
            });
    });

    it('should be able to authenticate with a valid username and password', function(done) {
        api.post('/api/authenticate')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                username: 'angel', // valid username
                password: 'secret' // valid password
            })
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.success).to.true;
                done();
            });
    });
});

describe('Users', function() {
    var token;

    before(function(done) {
        api.post('/api/authenticate')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                username: 'angel', // valid username
                password: 'secret' // valid password
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
    });

    it('should not be able to access users without a token', function(done) {
        api.get('/api/users')
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('No token provided.');
                done();
            });
    });

    it('should not be able to access users without a vailid token', function(done) {
        api.get('/api/users')
            .set('x-access-token', 'invalidtoken')
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Failed to authenticate token.');
                done();
            });
    });

    it('should return all users as JSON', function(done) {
        api.get('/api/users')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.be.instanceof(Array);
                done();
            });
    });

    it('should return a single user as JSON', function(done) {
        api.get('/api/users/550dccd11c96f38e8836f2c8')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('username');
                expect(res.body.username).to.not.equal(null);
                done();
            });
    });

    it('should not be able to get a user with an invalid ID', function(done) {
        api.get('/api/users/invalidid')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested user not found.');
                done();
            });
    });

    it('should not be able to get the photos of a user with an invalid ID', function(done) {
        api.get('/api/users/invalidid/photos')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested user not found.');
                done();
            });
    });

    it('should return all photos of user as JSON', function(done) {
        api.get('/api/users/550dccd11c96f38e8836f2c8/photos')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.be.instanceof(Array);
                done();
            });
    });

    it('should return last 4 photos of user as JSON', function(done) {
        api.get('/api/users/550dccd11c96f38e8836f2c8/photos/latest')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.be.instanceof(Array);
                expect(res.body).to.have.length(4);
                done();
            });
    });

    it('should return currently authetnicated user as JSON', function(done) {
        api.get('/api/me')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200, done);
    });
});

describe('Photos', function() {
    var token;

    before(function(done) {
        api.post('/api/authenticate')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                username: 'angel', // valid username
                password: 'secret' // valid password
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
    });

    it('should not be able to access photos without a token', function(done) {
        api.get('/api/photos')
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('No token provided.');
                done();
            });
    });

    it('should not be able to access photos without a vailid token', function(done) {
        api.get('/api/photos')
            .set('x-access-token', 'invalidtoken')
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Failed to authenticate token.');
                done();
            });
    });

    it('should return all photos as JSON', function(done) {
        api.get('/api/photos')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res.body).to.be.instanceof(Array);
                    done();
                });
    });

    it('should return a single photo as JSON', function(done) {
        api.get('/api/photos/550ed59a392855a6c6a95d30')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('url');
                expect(res.body.url).to.not.equal(null);
                expect(res.body).to.have.property('caption');
                expect(res.body.caption).to.not.equal(null);
                done();
            });
    });

    it('should not be able to get a photo with an invalid ID', function(done) {
        api.get('/api/photos/invalidid')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested photo not found.');
                done();
            });
    });

    it('should not be able to create a photo with a duplicate URL', function(done) {
        api.post('/api/photos')
            .set('x-access-token', token)
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                _user: '550dcd0ecf7ebdf588963991', // existing user ID
                url: 'http://i.imgur.com/dQPWiaT.jpg', // existing URL
                caption: 'Test caption.'
            })
            .expect(409)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('A photo with that URL already exists.');
                done();
            });
    });

    it('should not be able to create a photo without providing all required fields', function(done) {
        api.post('/api/photos')
            .set('x-access-token', token)
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Validation failed');
                done();
            });
    });

    it('should not be able to update a nonexistent photo', function(done) {
        api.put('/api/photos/invalidid')
            .set('x-access-token', token)
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested photo not found.');
                done();
            });
    });

    it('should not be able to update a photo with a duplicate URL', function(done) {
        api.put('/api/photos/550ed576392855a6c6a95d2e')
            .set('x-access-token', token)
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                url: 'http://i.imgur.com/01yZxOK.jpg',
                caption: 'Test caption.'
            })
            .expect(409)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('A photo with that URL already exists.');
                done();
            });
    });

    it('should not be able to update a photo by another user', function(done) {
        api.put('/api/photos/550ed59a392855a6c6a95d30')
            .set('x-access-token', token)
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                caption: 'Test caption.'
            })
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Unauthorised operation.');
                done();
            });
    });

    it('should not be able to delete a photo with an invalid ID', function(done) {
        api.delete('/api/photos/invalidid')
            .set('x-access-token', token)
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested photo not found.');
                done();
            });
    });

    it('should not be able to delete a photo by another user', function(done) {
        api.delete('/api/photos/550ed59a392855a6c6a95d30')
            .set('x-access-token', token)
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Unauthorised operation.');
                done();
            });
    });

    it('should not be able to get the comments of a photo with an invalid ID', function(done) {
        api.get('/api/photos/invalidid/comments')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested photo not found.');
                done();
            });
    });
});

describe('Comments', function() {
    var token;

    before(function(done) {
        api.post('/api/authenticate')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                username: 'angel', // valid username
                password: 'secret' // valid password
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
    });

    it('should not be able to access comments without a token', function(done) {
        api.get('/api/comments')
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('No token provided.');
                done();
            });
    });

    it('should not be able to access comments without a vailid token', function(done) {
        api.get('/api/comments')
            .set('x-access-token', 'invalidtoken')
            .set('Accept', 'application/json')
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Failed to authenticate token.');
                done();
            });
    });

    it('should return a single comment as JSON', function(done) {
        api.get('/api/comments/550eda0016d19fcaca04f111')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('content');
                expect(res.body.url).to.not.equal(null);
                done();
            });
    });

    it('should not be able to get a comment with an invalid ID', function(done) {
        api.get('/api/comments/invalidid')
            .set('x-access-token', token)
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested comment not found.');
                done();
            });
    });

    it('should not be able to create a comment without providing all required fields', function(done) {
        api.post('/api/comments')
            .set('x-access-token', token)
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Validation failed');
                done();
            });
    });

    it('should not be able to delete a comment with an invalid ID', function(done) {
        api.delete('/api/comments/invalidid')
            .set('x-access-token', token)
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Requested comment not found.');
                done();
            });
    });

    it('should not be able to delete a comment by another user', function(done) {
        api.delete('/api/comments/550eda0016d19fcaca04f111')
            .set('x-access-token', token)
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('Unauthorised operation.');
                done();
            });
    });
});
