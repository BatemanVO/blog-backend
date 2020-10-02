const mongoose = require('mongoose');

module.exports = {
    Message: mongoose.model('Message', new mongoose.Schema(
        {
            title: String,
            body: String
        },
        {
            timestamps: {
                createdAt: 'createdDate',
                updatedAt: 'modifiedDate'
            }
        })
    )
};
