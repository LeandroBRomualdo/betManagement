/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("bets", table => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid('user_id').notNullable();
        table.text('number').notNullable();
        table.integer('points').notNullable();
        table.dateTime('date').notNullable();
        table.tinyint('verified').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('bets');
};
