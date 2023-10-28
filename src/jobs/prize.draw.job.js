const rabbit = require('./rabbit.service')
const betRepository = require('../repositories/bet.repository')
const AnimalGroups = require('../data/animalGroups')
const walletRepository = require('../repositories/wallet.repository')
const winnerRepository = require('../repositories/winner.repository')

const env = require('dotenv').config()
const {QUEUE_NAME: PRIZE_DRAWN_QUEUE} = process.env

const GethundredAnimal = (hundred) => {
  for (const animal in AnimalGroups) {
    if (AnimalGroups[animal].includes(hundred)) {
      return animal;
    }
  }
}

function GetPrizeDrawnMessage(){
  rabbit.consumeFromQueue(PRIZE_DRAWN_QUEUE, message =>{
    const messageData = JSON.parse(message.content)
    const { id } = messageData
    const { hundredDrawn } = messageData
    const { animalDrawn } = messageData
    const { drawnAt } = messageData

    const result = betRepository.getPendingBets()

    result.then(pendingsBets => {
      pendingsBets.forEach(bet => {
        const { number } = bet
        const { points } = bet
        const { user_id } = bet
        const animal = GethundredAnimal(parseInt(number))

        if(hundredDrawn == number){
          const winner = {
            bet_drawn_id: id,
            bet_id: bet.id,
            drawn_at: drawnAt,
            prize_amount: points * 50
          }
  
          winnerRepository.inserir(winner)
          .then(response => console.log("Inserido"))
          .catch(err =>{
            console.log(err.message)
          })
          
          const wallet={
            prizeAmount: winner.prize_amount,
            transactionType: "credito"
          }
  
          walletRepository.SetBalance(user_id, wallet)
            .then(response => console.log("Alterado")
            .catch(err => {
              console.log(err.message)
            }))
        }
        
        else if(animal == animalDrawn){
          const winner = {
            bet_drawn_id: id,
            bet_id: bet.id,
            drawn_at: drawnAt,
            prize_amount: points * 20
          }
  
          winnerRepository.inserir(winner)
            .then((response) => console.log("Inserido"))
            .catch(err =>{
              console.log(err.message)
            })
  
          const wallet={
            prizeAmount: winner.prize_amount,
            transactionType: "credito"
          }
  
          walletRepository.SetBalance(user_id, wallet)
            .then(response => console.log("Alterado"))
            .catch( err => { console.log(err.message)})
        }
        bet.verified = true
        betRepository.update(bet.id, bet)
          .then(response => console.log("Alterado"))
          .catch(err => console.log(err.message))
      });
  }).catch(err =>{
      res.status(500).json(`Erro ao inserir user bet: ${err.message}`)
  })
  })
}

module.exports = {
  GetPrizeDrawnMessage,
} 