const Router = require('express')
const config = require('config')
const Account = require('../models/Account')
const router = new Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')


router.post('/registration',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Password must be longer than 4').isLength({min: 4})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({message: 'Incorrect email and/or password', errors})
            }
            const {email, password} = req.body
            const isExists = await Account.findOne({email})
            if (isExists) {
                return res.status(400).json({message: 'Account already exist'})
            }
            const hashedPassword = await bcrypt.hash(password, 8)
            const account = new Account({email, password: hashedPassword, createdAt: new Date()})
            await account.save()
            res.json({message: 'Account was created'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: e})
        }
    }
)

router.post('/login', async (req, res) => {
        try {
            const {email, password} = req.body
            const account = await Account.findOne({email})
            if (!account) {
                return res.status(404).json({message: 'Account not found'})
            }
            const isPasswordValid = bcrypt.compareSync(password, account.password)
            if (!isPasswordValid) {
                return res.status(400).json({message: 'Invalid password'})
            }
            const token = jwt.sign({id: account.id}, config.get('mySuperSecret'), {expiresIn: '1h'})
            return res.json({
                token,
                account: {
                    id: account.id,
                    email: account.email,
                    avatar: account.avatar,
                    createdAt: account.createdAt
                }
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({message: e})
        }
    }
)

module.exports = router
