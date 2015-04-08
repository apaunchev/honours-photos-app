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
