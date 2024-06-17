const request = require('supertest');
const app = require('../app');
const models = require('../models');

describe('Reservation Endpoints', () => {
    let token;

    beforeAll(async () => {
        // Obtain JWT token for authenticated requests
        const response = await request(app)
            .post('/login')
            .send({ email: 'user@example.com' });
        token = response.body.data.token;

        // Clear all the reservations
        await models.Reservation.deleteMany({});
    });

    it('should reserve a seat', async () => {
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', `Bearer ${token}`)
            .send({
                seatNumber: 40,
                passengerPhone: '1234567890',
                passengerName: 'John Doe',
                passengerAge: 30
            })
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Seat reserved successfully');
    });

    it('should not reserve a seat if missing required fields', async () => {
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', `Bearer ${token}`)
            .send({
                seatNumber: 4,
                passengerPhone: '1234567890'
                // Missing passengerName and passengerAge
            })
            .expect(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All passenger fields are required');
    });

    it('should not reserve a seat if invalid seat number', async () => {
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', `Bearer ${token}`)
            .send({
                seatNumber: "32",
                passengerPhone: '1234567890',
                passengerName: 'John Joe',
                passengerAge: 30
            })
            .expect(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid seat number');
    });

    it('should not reserve a seat if seat number not in the range', async () => {
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', `Bearer ${token}`)
            .send({
                seatNumber: 302,
                passengerPhone: '1234567890',
                passengerName: 'John Joe',
                passengerAge: 30
            })
            .expect(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Seat number must be between 1 and 300');
    });

    it('should not reserve a seat if already reserved', async () => {
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', `Bearer ${token}`)
            .send({
                seatNumber: 40,
                passengerPhone: '34876584',
                passengerName: 'John Doe',
                passengerAge: 35
            })
            .expect(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Seat is already reserved');
    });

    it('reset from non-admin user', async () => {
        const response = await request(app)
            .post('/seat/reset')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
        expect(response.body.success).toBe(false);
    });

});

describe('Reset Endpoints', () => {
    let non_admin_token, admin_token;

    beforeAll(async () => {
        // Obtain JWT token for authenticated requests
        let response = await request(app)
            .post('/login')
            .send({ email: 'user@example.com' });
        non_admin_token = response.body.data.token;

        response = await request(app)
            .post('/login')
            .send({ email: 'admin@sukasaair.com' });
        admin_token = response.body.data.token;

        // Clear all the reservations
        await models.Reservation.deleteMany();
    });

    it('should reserve a seat', async () => {
        const response = await request(app)
            .post('/seat/reserve')
            .set('Authorization', `Bearer ${non_admin_token}`)
            .send({
                seatNumber: 23,
                passengerPhone: '1234567890',
                passengerName: 'John Doe',
                passengerAge: 30
            })
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Seat reserved successfully');
    });

    it('reset from non-admin user', async () => {
        const response = await request(app)
            .post('/seat/reset')
            .set('Authorization', `Bearer ${non_admin_token}`)
            .expect(403);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Only admin can reset reservations');
    });

    it('reset from non-admin user', async () => {
        let count = await models.Reservation.countDocuments();
        expect(count).toBe(1);
        const response = await request(app)
            .post('/seat/reset')
            .set('Authorization', `Bearer ${admin_token}`)
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('All reservations have been reset');
        count = await models.Reservation.countDocuments();
        expect(count).toBe(0);});

    afterAll(async () => {
        app.close();
    });

});
