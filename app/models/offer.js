
/* 
 * Module dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Offer schema
*/

const OfferSchema = new Schema({
    name: { type: String, default: '' },
    date: { type: Date },
    user_id: { type: Date },
    created_at: { type: Date },
    edited_at: { type: Date }
});

/**
 * Register
 */

module.exports = mongoose.model('Offer', OfferSchema);
