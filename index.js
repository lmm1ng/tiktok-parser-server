const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const tiktokRouter = require('./routes/tiktok.routes')
const accountRouter = require('./routes/account.routes')
const corsMiddleware = require('../../sim_parser/server/middleware/cors.middleware')

const makeUsersSnapshot = require('./jobs/makeUsersSnapshot')

const app = express()
app.use(cookieParser())
app.use(corsMiddleware)
app.use(express.json())
app.use(express.static('static'))
app.use('/api/auth', authRouter)
app.use('/api/tiktok',tiktokRouter)
app.use('/api/account',accountRouter)

const PORT = config.get('serverPort')

const start = async () => {
    try {
        await mongoose.connect(config.get('dbUrl'))
        app.listen(PORT, () => {
            console.log(PORT)
        })
    } catch (e) {
        console.log('error')
    }
}

const CronJob = require('cron').CronJob

// const job = new CronJob('30 * * * * *', async () => {
const job = new CronJob('0 2 * * *', async () => {
    await makeUsersSnapshot()
})

job.start()

start()
