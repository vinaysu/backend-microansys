const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FormDataModel = require('./model');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection URI
const MONGODB_URI = 'mongodb+srv://vinay:vinay.s@vinay.leowher.mongodb.net/?retryWrites=true&w=majority&appName=vinay';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

app.post('/api/formdata', async (req, res) => {
    try {
        // Create a new instance of the FormDataModel using the request body
        const formData = new FormDataModel(req.body);

        // Save the form data to the database
        const savedData = await formData.save();

        // Respond with a success message and the saved data
        res.status(201).json({ message: 'Form data saved successfully', data: savedData });
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/list', async (req, res) => {
    try {
        // Fetch the list data from MongoDB
        const list = await FormDataModel.find();
        res.json(list); // Send the list data as JSON response
    } catch (error) {
        console.error('Error fetching list data:', error);
        res.status(500).json({ error: 'Failed to fetch list data' });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
