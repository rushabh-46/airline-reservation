const express = require('express');
const reservationController = require('../controllers/reservation');
const authToken = require('../middleware/authToken');

const router = express.Router();

/**
 * @swagger
 * /seat/reserve:
 *   post:
 *     summary: Reserve a seat
 *     description: Reserve a seat for a passenger. The seat number must be between 1 and 300.
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: integer
 *                 example: 25
 *               passengerPhone:
 *                 type: string
 *                 example: "+1234567890"
 *               passengerName:
 *                 type: string
 *                 example: "John Doe"
 *               passengerAge:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Seat reserved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Seat reserved successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error message describing the issue
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post('/reserve', authToken, reservationController.reserveSeat);

/**
 * @swagger
 * /seat/reset:
 *   post:
 *     summary: Reset all reservations
 *     description: Only the admin can reset all reservations. This endpoint will hard delete all entries in the reservations collection.
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All reservations have been reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All reservations have been reset
 *       403:
 *         description: Only admin can reset reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Only admin can reset reservations
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post('/reset', authToken, reservationController.resetReservations);

module.exports = router;
