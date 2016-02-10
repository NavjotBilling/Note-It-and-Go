/* Creates model for todo using mongoose for database */

var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {text: {type: String,
        default: ''
    }
});
