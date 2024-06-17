const request = require('supertest');
const app = require('../app');
const { v4: uuidv4 } = require('uuid');

describe('Authentication Endpoint', () => {
    it('should return a JWT token', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'user@example.com' })
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Token is generated');
        expect(response.body.data.token).toBeDefined();
    });

    it('should return 400 if email is missing', async () => {
        const response = await request(app)
            .post('/login')
            .send({})
            .expect(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email is required');
    });
});

describe('Authentication Middleware', () => {
    let valid_token;

    it('should return a JWT token', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'user2@example.com' })
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Token is generated');
        expect(response.body.data.token).toBeDefined();

        valid_token = response.body.data.token;
    });

    it('middleware should throw error if no token', async () => {
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', ``)
            .send({
                seatNumber: 56,
                passengerPhone: '1234567890',
                passengerName: 'John Joe',
                passengerAge: 30
            })
            .expect(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Missing token');
    });

    it('middleware should throw error if not a valid token', async () => {
        let non_valid_token = uuidv4();
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', `Bearer ${non_valid_token}`)
            .send({
                seatNumber: 56,
                passengerPhone: '1234567890',
                passengerName: 'John Joe',
                passengerAge: 30
            })
            .expect(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid or expired token');
    });

    afterAll(async () => {
        app.close();
    });
});
