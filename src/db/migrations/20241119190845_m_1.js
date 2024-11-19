/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.table('Donors', function (table) {
        table.decimal('best_frequency_of_donation',10,2);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.table('best_frequency_of_donation', function (table) {
        table.dropColumn()
    });
}