const knex = require('knex')(require('../../knexfile.js').development)
const table = 'winners'

function inserir(dado){
    return knex(table).insert({...dado}).returning('id')
}

function getByBetIdAndUserId(request){
    const { userId } = request
    const { betId } = request

    return knex(table).join('bets', 'bet_id', '=', 'bets.id').where('bets.id', betId).and('bets.userId', userId).returning(winners)
}

const betRepository = {
    inserir,
    getByBetIdAndUserId,
}

module.exports = betRepository