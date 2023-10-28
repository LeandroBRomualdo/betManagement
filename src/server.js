const env = require('dotenv').config()

const express = require ('express')
const cors = require('cors');
const app = express ()
const router = require('./routes/api.routes')

const prizeDrawnJob = require('../src/jobs/prize.draw.job')
prizeDrawnJob.GetPrizeDrawnMessage()

app.use(cors({
    origin: '*'
}));

app.use(express.json())
app.use(router)

let port = process.env.PORT || 3030
app.listen(port)