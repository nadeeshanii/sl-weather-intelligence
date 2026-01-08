require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- FIXED CORS CONFIGURATION ---
// Using '*' allows all domains (Vercel, Localhost, etc.) to access your data
app.use(cors({
  origin: '*', 
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ Connection error:", err.message));

// Schema Configuration
const ReadingSchema = new mongoose.Schema({}, { strict: false, collection: 'kalgunaya1' });
const Reading = mongoose.model('Reading', ReadingSchema);

// API: Welcome Route
app.get('/', (req, res) => {
    res.send("🚀 Weather API is running! Access data at /api/profiles/latest");
});

// API: Get the latest coordinate for each unique sensor
app.get('/api/profiles/latest', async (req, res) => {
    try {
        const latestPoints = await Reading.aggregate([
            { $sort: { timestamp: -1 } }, 
            {
                $group: {
                    _id: "$metadata.sensorId",
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));