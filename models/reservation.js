const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    seatNumber: { type: Number, required: true, unique: true, index: true },
    passengerPhone: { type: String, required: true },
    passengerName: { type: String, required: true },
    passengerAge: { type: Number, required: true },
    reservedBy: { type: String, required: true }
});

let Reservation;
try {
    Reservation = mongoose.model('Reservation', reservationSchema);
} catch (e) {
    console.error('Error creating reservation model', e.message);
}

module.exports = Reservation;
