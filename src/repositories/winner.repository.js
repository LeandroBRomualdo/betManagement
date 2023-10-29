const knex = require('knex')(require('../../knexfile.js').development)
const table = 'winners'

function inserir(dado){
    return knex(table).insert({...dado}).returning('id')
}

function getByBetIdAndUserId(request){
    const { userId } = request
    const { betId } = request

    return knex.from(table).innerJoin('bets', 'bet_id', 'bets.id').where('bets.id', '=', betId).andWhere('bets.user_Id', userId).returning(table)
}

const betRepository = {
    inserir,
    getByBetIdAndUserId,
}

module.exports = betRepository