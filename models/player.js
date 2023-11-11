const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    fullname: String,
    email: {type: String, required: true},
    phone_no: {type: String, required: true},
    ign: {type: String, unique: true, required: true},
    img_id: String,
    img_url: String,
    timestamp: Number,
    teamName: String, 
    payment_method: String,
    payment_status: String,
    game_choice: String,
    reg_day: String,
    reg_month: String,
    reg_year: String
}, {collection: 'registered_players'});

const model = mongoose.model('Player', playerSchema);
module.exports = model;