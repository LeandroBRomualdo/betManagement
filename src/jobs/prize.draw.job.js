const rabbit = require('../services/rabbitMq')
const betRepository = require('../repositories/bet.repository')
const AnimalGroups = require('../data/animalGroups')
const walletRepository = require('../repositories/wallet.repository')
const winnerRepository = require('../repositories/winner.repository')

const env = require('dotenv').config()
const { QUEUE_NAME } = process.env

const GethundredAnimal = (hundred) => {
  for (const animal in AnimalGroups) {
    if (AnimalGroups[animal].includes(hundred)) {
      return animal;
    }
  }
}

async function GetPrizeDrawnMessage(){
  const {channel} = await rabbit.connect()

  rabbit.consumeFromExchange(channel, QUEUE_NAME, '', function (message){
    console.log(message)
    const messageData = JSON.parse(message.content)
    console.log(messageData)
    const { id } = messageData
    const { hundredDrawn } = messageData
    const { animalDrawn } = messageData
    const { drawnAt } = messageData
    const winnersNotification = []

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

            winnersNotification.push({userId: user_id, prizeAmount: winner.prize_amount})
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

            winnersNotification.push({userId: user_id, prizeAmount: winner.prize_amount})
        }

        bet.verified = true
        betRepository.update(bet.id, bet)
          .then(response => console.log("Alterado"))
          .catch(err => console.log(err.message))
      });
  }).catch(err =>{
      res.status(500).json(`Erro ao inserir user bet: ${err.message}`)
  })

  rabbit.sendToQueue('winners', winnersNotification)
    .then(n => console.log("Notificação enviada"))
  })
  
}

module.exports = {
  GetPrizeDrawnMessage,
} 