const knex = require('knex')(require('../../knexfile.js').development)
const table = 'bets'

function inserir(dado){
    return knex(table).insert({...dado}).returning('id')
}

function getPendingBets(){
    return knex(table).where('verified', 0).returning('*')
}

function update(id, dado){
    return knex(table).where({id}).update(dado).returning('*')
}

const betRepository = {
    inserir,
    getPendingBets,
    update,
}

module.exports = betRepository