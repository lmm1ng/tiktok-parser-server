const User = require('../models/User')
const UserSnapshot = require('../models/UserSnapshot')
const tiktokService = require('../services/tiktokService')

const makeSnapshot = async (user) => {
    const tiktokUser = await tiktokService.getUser(user.uniqueId).catch(() => {
        return Promise.reject()
    })
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
    return Promise.resolve()
}

const makeUsersSnapshot = async () => {
    console.log('updateUsers...')
    const users = await User.find({})
    const errors = []
    for (const user of users) {
        await makeSnapshot(user).then(() => console.log(`success for ${user.uniqueId}`)).catch(() => {
            errors.push(user)
            console.log(`error on ${user.uniqueId}. Pushing`)
        })
    }
    while (errors.length) {
        console.log(errors.length)
        await makeSnapshot(errors[0]).then(() => {
            console.log('success in errors!')
            errors.splice(0, 1)
        }).catch(() => console.log('error in errors'))
    }
    console.log('updateCompleted!')
}

module.exports = makeUsersSnapshot