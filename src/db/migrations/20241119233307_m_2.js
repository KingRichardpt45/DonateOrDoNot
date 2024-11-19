/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.table('Campaigns', function (table) {
        table.renameColumn('bank_accounts_id',"bank_account_id");
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.table('Campaigns', function (table) {
        table.renameColumn('bank_account_id',"bank_accounts_id");
    });
}