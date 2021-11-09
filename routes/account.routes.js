const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controllers/accountController')
const router = new Router()

router.post('/users', authMiddleware, accountController.addUser)
router.get('/users', authMiddleware, accountController.getUsers)
router.get('/user', authMiddleware, accountController.getUserInfo)

module.exports = router