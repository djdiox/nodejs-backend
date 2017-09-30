
/* 
 * Module dependencies
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Todo schema
*/

const TodoSchema = new Schema({
    name: { type: String, default: '' },
    start: { type: Date },
    end: { type: Date },
    user_id: { type: Date },
    created_at: { type: Date },
    edited_at: { type: Date }
});

/**
 * Register
 */

module.exports = mongoose.model('Todo', TodoSchema);
