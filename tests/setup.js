// tests/setup.js
const mongoose = require('mongoose');
const { mongoose: mongooseConfig } = require('../config');

beforeAll(async () => {
    await mongoose.connect(mongooseConfig.testUrl);
});

afterAll(async () => {
    await mongoose.connection.close();
});
