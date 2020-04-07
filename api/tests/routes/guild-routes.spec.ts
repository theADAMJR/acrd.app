import request from 'supertest';
import { app, bot } from '../../server';
import { Client, Guild } from 'discord.js';
import { Collection } from 'mongoose';
describe('routes/api/guilds', () => {
    let url: string;
    const guild = {
        name: 'Test Guild'
    };

    beforeEach(() => {
        url = '/api/guilds';
        bot.guilds.cache = new Map<string, Guild>() as any;
        bot.guilds.cache.set('123', guild as any);
    });
    
    describe('GET /:id/public', () => {
        url += '/321/public';

        it('found guild, returns guild', (done) => {
            request(app).get(url)
                .expect(200)
                .expect(guild)
                .end(done);
        });

        it('unknown guild, returns undefined', (done) => {
            request(app).get(url)
                .expect(200)
                .expect(undefined)
                .end(done);
        });
    });
        
    describe('GET /', () => {
        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('POST /', () => {
        it('no key, returns 400', (done) => {
            request(app).get(url)
                .expect(400)
                .end(done);
        });
    });
    
    describe('GET /:id/users', () => {
        url += '/123/users';

        it('unknown guild, returns 404', (done) => {
            request(app).get(url)
                .expect(404)
                .end(done);
        });
    });
});
