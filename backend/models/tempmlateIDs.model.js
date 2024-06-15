const mongoose = require('mongoose');

const templateIDSchema = mongoose.Schema({
    TEMPLATE_NAME: String,
    TEMPLATE_ID: String,    
}, {
    timestamps: true,
    strict: false
});

module.exports.templateID = mongoose.model('templateID', templateIDSchema);