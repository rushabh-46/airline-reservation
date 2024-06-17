const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Initialize an empty object to hold the models
const models = {};

// Read all files in the current directory
fs.readdirSync(__dirname).forEach(file => {
    // Skip the index file
    if (file === 'index.js') return;

    // Construct the full path to the file
    const filePath = path.join(__dirname, file);

    // Require the model file and add it to the models object
    const model = require(filePath);
    models[model.modelName] = model;
});

// Export the models object
module.exports = models;
