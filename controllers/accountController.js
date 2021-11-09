const tiktokService = require('../services/tiktokService')
const User = require('../models/User')
const UserSnapshot = require('../models/UserSnapshot')
const Account = require('../models/Account')

class AccountController {
    async addUser (req, res) {
        try {
            const account = await Account.findOne({ _id: req.account.id })
            const dbUser = await User.findOne({ uniqueId: req.body.username })

            if (dbUser) {
                const isUserInAccount = account.users.find(userObjectId => userObjectId.toString() === dbUser._id.toString())
                if (isUserInAccount) {
                    return res.status(400).json({ message: 'User already in account' })
                }
                account.users.push(dbUser._id)
                await account.save()
                return res.status(200).json({ message: 'User added successfully' })
            }

            const tiktokUser = await tiktokService.getUser(req.body.username)
            const userToCreate = new User({
                userId: tiktokUser.userInfo.user.id,
                secUid: tiktokUser.userInfo.user.secUid,
                uniqueId: tiktokUser.userInfo.user.uniqueId,
                nickname: tiktokUser.userInfo.user.nickname,
                avatar: tiktokUser.userInfo.user.avatarMedium,
                createdAt: new Date(),
            })
            const userSnapshotToCreate = new UserSnapshot({
                userId: tiktokUser.userInfo.user.id,
                followerCount: tiktokUser.userInfo.stats.followerCount,
                followingCount: tiktokUser.userInfo.stats.followingCount,
                videoCount: tiktokUser.userInfo.stats.videoCount,
                heartCount: tiktokUser.userInfo.stats.heartCount,
                createdAt: new Date(),
            })

            userToCreate.snapshots.push({
                $each: [userSnapshotToCreate._id],
                $position: 0
            })

            await userSnapshotToCreate.save()
            await userToCreate.save()
            account.users.push(userToCreate._id)
            await account.save()
            return res.status(200).json({ message: 'User added successfully' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Server Error' })
        }
    }

    async getUsers (req, res) {
        try {
            const account = await Account.findOne({ _id: req.account.id })
            const out = []
            for (const userId of account.users) {
                const dbUser = await User.findOne({ _id: userId })
                const outUser = {
                    uniqueId: dbUser.uniqueId,
                    nickname: dbUser.nickname,
                    createdAt: dbUser.createdAt,
                    avatar: dbUser.avatar
                }
                const outSnapshots = []
                for (const snapshot of dbUser.snapshots) {
                    console.log(snapshot)
                    const dbSnapshot = await UserSnapshot.findOne({ _id: snapshot.toString() })
                    console.log(dbSnapshot)
                    outSnapshots.push({
                        followerCount: dbSnapshot.followerCount,
                        followingCount: dbSnapshot.followingCount,
                        videoCount: dbSnapshot.videoCount,
                        heartCount: dbSnapshot.heartCount,
                        createdAt: dbSnapshot.createdAt,
                    })
                }
                outUser.snapshots = outSnapshots
                out.push(outUser)
            }
            return res.status(200).json({ list: out })
        } catch
            (e) {
            console.log(e)
            return res.status(500).json({ message: 'Server Error' })
        }
    }
}

module.exports = new AccountController()