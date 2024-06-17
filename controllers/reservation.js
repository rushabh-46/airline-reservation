const mongoose = require('mongoose');
const models = require('../models');
const Reservation = models.Reservation;
const { sendResponse } = require('../utils/response');

const reserve = async (req, res) => {
    const { seatNumber, passengerPhone, passengerName, passengerAge } = req.body;
    const { email } = req.user;

    console.debug('Request body:', seatNumber, passengerPhone, passengerName, passengerAge);

    if (!passengerPhone || !passengerName || !passengerAge) {
        return sendResponse(res, 400, false, 'All passenger fields are required');
    }

    if (typeof seatNumber != 'number') {
        return sendResponse(res, 400, false, 'Invalid seat number');
    }

    if (seatNumber < 1 || seatNumber > 300) {
        return sendResponse(res, 400, false, 'Seat number must be between 1 and 300');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingReservation = await Reservation.findOne({ seatNumber }).session(session); // will ensure row lock
        if (existingReservation) {
            await session.abortTransaction();
            session.endSession();
            return sendResponse(res, 400, false, 'Seat is already reserved');
        }

        const reservation = new Reservation({
            seatNumber,
            passengerPhone,
            passengerName,
            passengerAge,
            reservedBy: email
        });

        await reservation.save({ session });

        await session.commitTransaction();
        session.endSession();
        return sendResponse(res, 200, true, 'Seat reserved successfully');
    } catch (err) {
        console.error('Error in reserving seat: ' + err.message);
        await session.abortTransaction();
        session.endSession();
        return sendResponse(res, 500, false, 'Internal server error', null, err.message);
    }
};

const reset = async (req, res) => {
    const { email } = req.user;

    if (email !== 'admin@sukasaair.com') {
        return sendResponse(res, 403, false, 'Only admin can reset reservations');
    }

    try {
        await Reservation.deleteMany({}); // Hard deletes all entries
        return sendResponse(res, 200, true, 'All reservations have been reset');
    } catch (err) {
        return sendResponse(res, 500, false, 'Internal server error', null, err.message);
    }
};

module.exports = {
    reserveSeat: reserve,
    resetReservations: reset,
}