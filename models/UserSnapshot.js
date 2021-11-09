const { Schema, model } = require('mongoose')

const UserSnapshot = new Schema({
    userId: { type: String, required: true },
    followerCount: { type: Number, required: true },
    followingCount: { type: Number, required: true },
    videoCount: { type: Number, required: true },
    heartCount: { type: Number, required: true },
    createdAt: { type: Date, required: true },
})

module.exports = model('UserSnapshot', UserSnapshot)