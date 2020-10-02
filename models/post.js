const mongoose = require('mongoose');

module.exports = {
    Post: mongoose.model('Post', new mongoose.Schema(
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
