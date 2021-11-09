const pythonMediator = require('../utils/pythonMediator')

class TiktokService {
    async getUsersList(username) {
        return await pythonMediator.runScript('getUserListByName', username)
    }
    async getUser(username) {
        return await pythonMediator.runScript('getUser', username)
    }
}

module.exports = new TiktokService()