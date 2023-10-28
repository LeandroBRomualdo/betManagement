const express = require('express')

const betController = require ('../controllers/bet.controller')

const apiRouter = express.Router()

apiRouter.post('/api/v1/bets', betController.placeABet)
apiRouter.get('/api/v1/bets/:betId/user/:userId', betController.getUserResult)
apiRouter.use((req, res) => {
    res.status(404).send('Recurso não encontrado!')
})

module.exports = apiRouter