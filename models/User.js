const { Schema, model, ObjectId } = require('mongoose')

const User = new Schema({
    userId: { type: String, required: true, unique: true },
    secUid: { type: String, required: true, unique: true },
    uniqueId: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    snapshots: [{ type: ObjectId, ref: 'UserSnapshot' }],
    avatar: { type: String, default: '' },
    videos: [{ type: ObjectId, ref: 'Video' }],
    createdAt: { type: Date, required: true },
})

module.exports = model('User', User)