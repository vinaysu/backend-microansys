const mongoose = require('mongoose');

// Define a schema for the data
const FormDataSchema = new mongoose.Schema({
    enquirerType: { type: String, required: true },
    enquirerName: { type: String, required: true },
    enquirerMobile: { type: String, required: true },
    enquirerWhatsapp: { type: String },
    productEnquired: { type: String, required: true },
    studentsClass: { type: String, required: true },
    studentsBoard: { type: String, required: true },
    studentName: { type: String, required: true },
});

// Create a model based on the schema
const FormDataModel = mongoose.model('FormData', FormDataSchema);

module.exports = FormDataModel;
