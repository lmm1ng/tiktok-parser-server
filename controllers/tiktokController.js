const tiktokService = require('../services/tiktokService')

class TiktokController {
    async getUsersList (req, res) {
        try {
            const userList = await tiktokService.getUsersList(req.query.username)
            res.json({
                list: userList.map(user => ({
                        userId: user.user.id,
                        secUid: user.user.secUid,
                        uniqueId: user.user.uniqueId,
                        nickname: user.user.nickname,
                        avatar: user.user.avatarMedium,
                        followerCount: user.stats.followerCount,
                        followingCount: user.stats.followingCount,
                        heartCount: user.stats.heartCount,
                        videoCount: user.stats.videoCount,
                    })
                ).slice(0, req.query.limit)
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server Error' })
        }
    }
}

module.exports = new TiktokController()