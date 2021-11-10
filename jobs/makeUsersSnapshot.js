const User = require('../models/User')
const UserSnapshot = require('../models/UserSnapshot')
const tiktokService = require('../services/tiktokService')

const makeUsersSnapshot = async () => {
    console.log('updateUsers...')
    const users = await User.find({})
    for (const user of users) {
        const tiktokUser = await tiktokService.getUser(user.uniqueId)
        const newSnapshot = new UserSnapshot({
            userId: tiktokUser.userInfo.user.id,
            followerCount: tiktokUser.userInfo.stats.followerCount,
            followingCount: tiktokUser.userInfo.stats.followingCount,
            videoCount: tiktokUser.userInfo.stats.videoCount,
            heartCount: tiktokUser.userInfo.stats.heartCount,
            createdAt: new Date(),
        })
        newSnapshot.save()
        user.avatar = tiktokUser.userInfo.user.avatarMedium
        user.snapshots.push({
            $each: [newSnapshot._id],
            $position: 0
        })
        user.save()
    }
    console.log('updateCompleted!')
}

module.exports = makeUsersSnapshot