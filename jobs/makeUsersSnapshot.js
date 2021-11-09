const User = require('../models/User')
const mongoose = require('mongoose')
const config = require('config')
const tiktokService = require('../services/tiktokService')

const makeUsersSnapshot = async () => {
    console.log('updateUser...')
    await mongoose.connect(config.get('dbUrl'))
    const users = await User.find({})
    for (const user of users) {
        const tiktokUser = await tiktokService.getUser(user.uniqueId)
        user.avatar = tiktokUser.userInfo.user.avatarMedium,
        user.snapshots.push({
            followerCount: tiktokUser.userInfo.stats.followerCount,
            followingCount: tiktokUser.userInfo.stats.followingCount,
            videoCount: tiktokUser.userInfo.stats.videoCount,
            heartCount: tiktokUser.userInfo.stats.heartCount,
            createdAt: new Date(),
        })
        user.save()
    }
    console.log('updateComplete!')
}

module.exports = makeUsersSnapshot