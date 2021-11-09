const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controllers/accountController')
const router = new Router()

router.post('/users', authMiddleware, accountController.addUser)
router.get('/users', authMiddleware, accountController.getUsers)

module.exports = router