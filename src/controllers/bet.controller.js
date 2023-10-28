const placeBetRequestDto = require('../schemas/Dtos/placeBetRequest.dto')
const walletRepository = require('../repositories/wallet.repository')
const betRepository = require('../repositories/bet.repository')
const bet = require('../schemas/schema.bet')

async function placeABet(req, res) {
    const request = req.body
    placeBetRequestDto.parse(request)

    const { saldo }  = await walletRepository.getBalance(request.userId)

    if(saldo >= request.bettingPoints){

        const objRequest = {
            user_id: request.userId,
            number: request.betNumber,
            points: request.bettingPoints,
            date: (new Date()).toJSON(),
            verified: false,
        }

        const dado = betRepository.inserir(objRequest)

        dado.then(result => {
            const walletRequest={
                prizeAmount: request.bettingPoints,
                transactionType: "debito"

            }
            const wallet = walletRepository.SetBalance(user_id, walletRequest)
        }).catch(err =>{
            res.status(500).json(`Erro ao inserir user bet: ${err.message}`)
        })
    }

    else{
        res.status(400).json('Não há saldo para concluir a operação.')
    }

}

function getUserResult(req, res){

}

module.exports = {
    placeABet,
    getUserResult,
}