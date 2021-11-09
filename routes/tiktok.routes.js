const Router = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const tiktokController = require('../controllers/tiktokController')
const router = new Router()

router.get('/users', authMiddleware, tiktokController.getUsersList)

module.exports = router