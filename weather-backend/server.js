require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ Connection error:", err.message));

// Schema matches your Compass screenshot
const ReadingSchema = new mongoose.Schema({}, { strict: false, collection: 'kalgunaya1' });
const Reading = mongoose.model('Reading', ReadingSchema);

// API: Get the latest coordinate for each unique sensor
app.get('/api/profiles/latest', async (req, res) => {
    try {
        const latestPoints = await Reading.aggregate([
            { $sort: { timestamp: -1 } }, 
            {
                $group: {
                    _id: "$metadata.sensorId", // Group by the ID in your metadata
                    latestData: { $first: "$$ROOT" } 
                }
            },
            { $replaceRoot: { newRoot: "$latestData" } }
        ]);
        res.json(latestPoints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API: Get history for time-series chart
app.get('/api/history/:sensorId', async (req, res) => {
    try {
        const history = await Reading.find({ "metadata.sensorId": req.params.sensorId })
            .sort({ timestamp: 1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(5000, () => console.log(`🚀 Server: http://localhost:5000`));