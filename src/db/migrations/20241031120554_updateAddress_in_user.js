/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

    return knex.schema.table('Users', function(table) {
        table.dropColumn('address_id');
        table.integer('addresse_id').notNullable().unsigned().defaultTo(0)
            .references('id').inTable('Addresses')
            .onDelete('CASCADE').onUpdate('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('Users', function(table) {
        table.dropColumn('addresse_id');
        table.integer('address_id').notNullable().unsigned().defaultTo(0)
            .references('id').inTable('Addresses')
            .onDelete('SET NULL').onUpdate('CASCADE');
    });
};