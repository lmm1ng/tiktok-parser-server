const {Schema, model, ObjectId} = require('mongoose')

const Account = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String, default: 'default'},
    createdAt: {type: Date, required: true},
    users: [{type: ObjectId, ref: 'User'}]
})

module.exports = model('Account', Account)