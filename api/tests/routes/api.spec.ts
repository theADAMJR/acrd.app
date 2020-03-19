import * as request from 'supertest';
import { app } from '../../server';

describe('routes/api', () => {
    describe('/', () => {
        it('returns 200', () => {
            request(app).get('/api')
                .expect(200);
        });
    });

    describe('/commands', () => {
        const url = '/api/commands';
        it('returns 200', () => {
            request(app).get(url)
                .expect(200)
                .expect('content-type', 'application/json');
        });
    });

    it('any', () => {
        request(app).get('/api/a')
            .expect(404)
            .expect('content-type', 'application/json');
    });
});
