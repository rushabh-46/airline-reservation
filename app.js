const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenvConfig = require('dotenv').config();
const { mongoose: mongooseConfig } = require('./config');
const { swaggerUi, specs: swaggerSpecs } = require('./config/swagger');

const authRoute = require('./routes/authorization');
const reservationRoute = require('./routes/reservation');

mongoose.connect(process.env.TESTING==1 ? mongooseConfig.testUrl : mongooseConfig.url)
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch(err => {
        console.error('Error connecting to MongoDB');
        console.error(err);
    });

const app = express();
app.use(bodyParser.json());

// Swagger API documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Use routes
app.use(authRoute);
app.use('/seat', reservationRoute);

// Start the server
const PORT = process.env.PORT || 3000;
let server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
