
/* 
 * Module dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Sound schema
*/

const SoundSchema = new Schema({
    name: { type: String, default: '' },
    user_id: { type: Date },
    created_at: { type: Date },
    edited_at: { type: Date }
});

/**
 * Register
 */

mongoose.model('Sound', SoundSchema);
