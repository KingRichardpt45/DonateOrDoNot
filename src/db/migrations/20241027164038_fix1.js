/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('Badges', function(table) {
        table.dropColumn('campaign_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('Badges', function(table) {
        table.integer('campaign_id').unsigned()
            .references('id').inTable('Campaigns')
            .onDelete('NO ACTION').onUpdate('NO ACTION');
    });
};
