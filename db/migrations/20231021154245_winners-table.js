/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('winners', table => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.text('bet_drawn_id').notNullable();
        table.uuid('bet_id').references('id').inTable('bets');
        table.dateTime('drawn_at');
        table.decimal('prize_amount');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
