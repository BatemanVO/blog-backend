const mongoose = require('mongoose');

module.exports = {
    Post: mongoose.model('Post', new mongoose.Schema(
        {
            title: { type: String, unique: true, required: true },
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
