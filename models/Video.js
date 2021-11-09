const {Schema, model} = require('mongoose')

const Snapshot = new Schema({
    heartCount: {type: Number, required: true},
    commentCount: {type: Number, required: true},
    viewsCount: {type: Number, required: true},
    repostCount: {type: Number, required: true},
    createdAt: {type: Number, required: true},
})

const Video = new Schema({
    videoId: {type: String, unique: true, required: true},
    createdAt: {type: Date, unique: true, required: true},
    snapshots: [Snapshot]
})

module.exports = model('Video', Video)