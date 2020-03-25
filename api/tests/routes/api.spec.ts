import request from 'supertest';
import { app } from '../../server';

describe('routes/api', () => {
    describe('/', () => {
        it('returns 200', (done) => {
            request(app).get('/api')
                .expect(200)
                .end(done);
        });
    });

    describe('/commands', () => {
        const url = '/api/commands';

        it('returns 200', (done) => {
            request(app).get(url)
                .expect(200)
                .end(done);
        });
    });

    describe('/auth', () => {
        const url = '/api/auth';

        it('no code, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('/user', () => {
        const url = '/api/user';

        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('GET /guilds', () => {
        const url = '/api/guilds';

        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('POST /guilds', () => {
        const url = '/api/guilds';

        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });

    it('any url returns 404', (done) => {
        request(app).get('/api/a')
            .expect(404)
            .end(done);
    });
});
