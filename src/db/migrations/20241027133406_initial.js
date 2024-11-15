/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('Addresses', function(table) {
        table.increments('id').primary();
        table.string('postal_code', 45).nullable();
        table.string('city').nullable();
        table.string('address').nullable();
        table.string('door').nullable();
      })
      .createTable('Users', function(table) {
        table.increments('id').primary();
        table.integer('address_id').notNullable().unsigned()
             .references('id').inTable('Addresses')
             .onDelete('SET NULL').onUpdate('CASCADE');
        table.integer('profile_image_id').unsigned().nullable()
            .references('id').inTable('Files')
            .onDelete('SET NULL').onUpdate('CASCADE');
        table.string('first_name').notNullable();
        table.string('middle_names').notNullable();
        table.string('last_name').notNullable();
        table.string('email', 45).notNullable();
        table.string('email_confirmation_token', 45).nullable();
        table.boolean('email_confirmed').notNullable().defaultTo(false);
        table.string('phone_number', 45).nullable();
        table.string('password', 70).notNullable();
        table.integer('status').unsigned().notNullable().defaultTo(0);
        table.integer('type').unsigned().notNullable().defaultTo(0);
      })
      .createTable('Files', function(table) {
        table.increments('id').primary();
        table.integer('uploaded_by_user_id').unsigned().nullable().defaultTo(null)
             .references('id').inTable('Users')
             .onDelete('NO ACTION').onUpdate('CASCADE');
        table.integer('campaign_id').unsigned().nullable().defaultTo(null)
             .references('id').inTable('Campaigns')
             .onDelete('NO ACTION').onUpdate('CASCADE');
        table.datetime('timestamp').defaultTo(knex.fn.now());
        table.string('original_name', 200).notNullable();
        table.string('file_path').notNullable();
        table.integer('file_suffix').unsigned().notNullable();
        table.integer('size').notNullable();
        table.integer('file_type').unsigned().notNullable();
      })
      .createTable('Notifications', function(table) 
      {
        table.increments('id').primary();
        table.string('message', 200).nullable();
        table.integer('type').unsigned().nullable();
        table.integer('user_id').unsigned().notNullable()
             .references('id').inTable('Users')
             .onDelete('CASCADE').onUpdate('CASCADE');
        table.integer('campaign_id').unsigned();//todo
        
      });

      // .createTable('Donors', function(table) {
      //   table.integer('user_id').primary().unsigned()
      //        .references('id').inTable('Users')
      //        .onDelete('CASCADE').onUpdate('CASCADE');
      //   table.integer('donacoins').notNullable().defaultTo(0);
      // })
      // .createTable('CampaignManagers', function(table) {
      //   table.integer('user_id').primary().unsigned()
      //        .references('id').inTable('Users')
      //        .onDelete('NO ACTION').onUpdate('NO ACTION');
      //   table.integer('type').unsigned().notNullable().defaultTo(0);
      //   table.string('description', 2000).nullable();
      //   table.integer('identification_file').nullable().unsigned()
      //       .references('id').inTable('Files')
      //       .onDelete('SET NULL').onUpdate('CASCADE');
      //   table.string('contact_email').nullable();
      // })
      // .createTable('Campaigns', function(table) {
      //   table.increments('id').primary();
      //   table.integer('status').notNullable().defaultTo(0);
      //   table.string('title', 80).notNullable();
      //   table.string('description', 2000).nullable();
      //   table.integer('category').nullable();
      //   table.datetime('end_date').nullable();
      //   table.decimal('objective_value', 10, 2).notNullable().defaultTo(0);
      //   table.decimal('current_value', 10, 2).notNullable().defaultTo(0);
      //   table.integer('donation_counter').unsigned().notNullable().defaultTo(0);
      //   table.integer('campaign_manager_id').notNullable().unsigned()
      //        .references('user_id').inTable('CampaignManagers')
      //        .onDelete('No ACTION').onUpdate('CASCADE');
      //   table.integer("bank_accounts_id").notNullable().unsigned()
      //       .references('id').inTable("BankAccounts")
      //       .onDelete('No ACTION').onUpdate('CASCADE');
      // })
      // .createTable("BankAccounts",function(table){
      //   table.increments('id').primary();
      //   table.string('iban', 34).nullable();
      //   table.string('account_holder').nullable();
      //   table.string('bank_name').nullable();
      // })
      
      // .createTable('Badges', function(table) {
      //   table.increments('id').primary();
      //   table.integer('type').unsigned().notNullable();
      //   table.string('name', 100).nullable();
      //   table.string('description', 200).nullable();
      //   table.decimal('value', 10, 2).nullable();
      //   table.integer('unit').nullable();
      //   table.integer('campaign_id').unsigned()
      //        .references('id').inTable('Campaigns')
      //        .onDelete('NO ACTION').onUpdate('NO ACTION');
      // })
      // .createTable('CampaignBadges', function(table) {
      //   table.primary(["campaign_id","badge_id"]);
      //   table.integer('campaign_id').unsigned()
      //       .references('id').inTable('Campaigns')
      //       .onDelete('CASCADE').onUpdate('CASCADE');
      //   table.integer('badge_id').unsigned()
      //       .references('id').inTable('Badges')
      //       .onDelete('CASCADE').onUpdate('CASCADE');
      // })
      // .createTable('Donations', function(table) {
      //   table.increments('id').primary();
      //   table.integer('campaign_id').unsigned().notNullable()
      //        .references('id').inTable('Campaigns')
      //        .onDelete('NO ACTION').onUpdate('NO ACTION');
      //   table.integer('donor_id').unsigned().notNullable()
      //        .references('user_id').inTable('Donors')
      //        .onDelete('NO ACTION').onUpdate('NO ACTION');
      //   table.decimal('value', 10, 2).notNullable().defaultTo(0);
      //   table.boolean('is_name_hidden').notNullable().defaultTo(false);
      //   table.string('comment', 500).nullable();
      // })
      // .createTable('UserBadges', function(table) {
      //   table.integer('user_id').unsigned().notNullable()
      //        .references('id').inTable('Users')
      //        .onDelete('CASCADE').onUpdate('CASCADE');
      //   table.integer('badge_id').unsigned().notNullable()
      //        .references('id').inTable('Badges')
      //        .onDelete('CASCADE').onUpdate('CASCADE');
      //   table.datetime('comquered_at').defaultTo(knex.fn.now());
      //   table.primary(['user_id', 'badge_id']);
      // })
  };
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('Notifications')
        .dropTableIfExists('UserBadges')
        .dropTableIfExists('Donations')
        .dropTableIfExists('Badges')
        .dropTableIfExists('Files')
        .dropTableIfExists('Campaigns')
        .dropTableIfExists('CampaignManagers')
        .dropTableIfExists('CampaignBadges')
        .dropTableIfExists('Donors')
        .dropTableIfExists('Users')
        .dropTableIfExists('Addresses')
        .dropTableIfExists('Bank_Accounts');
};