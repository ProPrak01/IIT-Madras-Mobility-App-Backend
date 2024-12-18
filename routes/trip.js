const express = require('express');
const Trip = require('../models/trip'); // Assuming you have a Trip model
const Monument = require('../models/monument'); // Assuming you have a Monument model
const User = require('../models/user'); // Assuming you have a User model

const tripRouter = express.Router();

tripRouter.post('/add', async (req, res) => {
    try {
        const { userId, monuments,purpose,mode} = req.body;

        // Validate that userId and monuments are provided
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!monuments || !Array.isArray(monuments) || monuments.length === 0) {
            return res.status(400).json({ message: 'At least one monument is required' });
        }
        //validate user id
        const validUser = await User.findById(userId);
        if (!validUser) {
            return res.status(400).json({ message: 'User ID is invalid' });
        }
        // Validate that all monument IDs exist in the database
        const validMonuments = await Monument.find({ _id: { $in: monuments } });
        if (validMonuments.length !== monuments.length) {
            return res.status(400).json({ message: 'Some monument IDs are invalid' });
        }

        // Create a new trip
        const newTrip = new Trip({
            userId,
            monuments, // Array of valid Monument IDs
            purpose,
            mode
        });

        // Save the trip to the database
        await newTrip.save();

        res.status(201).json({trip: newTrip });
    } catch (error) {
        res.status(500).json({ message: 'Error adding trip', error: error.message });
    }
});

// Endpoint to fetch trip details of one user
tripRouter.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const trips = await Trip.find({ userId });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error });
    }
});

// Endpoint to fetch all trips
tripRouter.get('/all', async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error });
    }
});

module.exports = tripRouter;