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
        table.string('specification').nullable();
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
        table.string('middle_names').nullable();
        table.string('last_name').nullable();
        table.string('email').notNullable().unique();
        table.string('email_confirmation_token').nullable();
        table.boolean('email_confirmed').notNullable().defaultTo(false);
        table.string('phone_number', 45).nullable();
        table.string('password', 70).notNullable();
        table.integer('status').unsigned().notNullable().defaultTo(0);
        table.integer('type').unsigned().notNullable().defaultTo(0);
      })
      .createTable('Files', function(table) {
        table.increments('id').primary();
        
        table.integer('user_id').unsigned().nullable().defaultTo(null)
             .references('id').inTable('Users')
             .onDelete('CASCADE').onUpdate('CASCADE');
        
        table.integer('campaign_id').unsigned().nullable().defaultTo(null)
             .references('id').inTable('Campaigns')
             .onDelete('NO ACTION').onUpdate('CASCADE');

        table.integer('badge_id').unsigned().nullable().defaultTo(null)
             .references('id').inTable('Badges')
             .onDelete('NO ACTION').onUpdate('CASCADE');
        
        table.string('original_name').notNullable();
        table.string('file_suffix').notNullable();
        table.integer('file_type').unsigned().notNullable();
        table.string('file_path').notNullable();
        table.datetime('timestamp').defaultTo(knex.fn.now());
        table.integer('size').notNullable();
      })
      .createTable('Notifications', function(table) 
      {
        table.increments('id').primary();

        table.integer('user_id').unsigned().notNullable()
             .references('id').inTable('Users')
             .onDelete('CASCADE').onUpdate('CASCADE');

        table.integer('campaign_id').unsigned()
            .references('id').inTable('Campaigns')
            .onDelete('CASCADE').onUpdate('CASCADE');
        
        table.string('message', 200).nullable();
        table.integer('type').unsigned().nullable();
      })
      .createTable('Badges', function(table) 
      {
        table.increments('id').primary();

        table.integer('image_id').unsigned()
          .references('id').inTable('Files')
          .onDelete('NO ACTION').onUpdate('CASCADE');

        table.string('name', 100).nullable();
        table.string('description', 200).nullable();
        table.decimal('value', 10, 2).nullable();
        table.integer('unit').nullable();
        table.integer('type').unsigned().notNullable();
      })
      .createTable('UserBadges', function(table) 
      {
        table.increments('id').primary();

        table.integer('user_id').unsigned().notNullable()
             .references('id').inTable('Users')
             .onDelete('CASCADE').onUpdate('CASCADE');

        table.integer('badge_id').unsigned().notNullable()
             .references('id').inTable('Badges')
             .onDelete('CASCADE').onUpdate('CASCADE');

        table.datetime('unblock_at').defaultTo(knex.fn.now());
      })
      .createTable('CampaignBadges', function(table) 
      {
        table.increments('id').primary();

        table.integer('campaign_id').unsigned().notNullable()
             .references('id').inTable('Users')
             .onDelete('CASCADE').onUpdate('CASCADE');

        table.integer('badge_id').unsigned().notNullable()
             .references('id').inTable('Badges')
             .onDelete('CASCADE').onUpdate('CASCADE');
      })
      .createTable('Campaigns', function(table) 
      {
        table.increments('id').primary();

        table.integer('campaign_manager_id').notNullable().unsigned()
              .references('user_id').inTable('CampaignManagers')
              .onDelete('NO ACTION').onUpdate('CASCADE');

        table.integer("bank_accounts_id").notNullable().unsigned()
            .references('id').inTable("BankAccounts")
            .onDelete('NO ACTION').onUpdate('CASCADE');

        table.string('title',80).notNullable();
        table.string('description', 2000).nullable();
        table.decimal('objective_value', 10, 2).notNullable().defaultTo(0);
        table.decimal('current_donation_value', 10, 2).notNullable().defaultTo(0);
        table.integer('category').nullable();
        table.datetime('end_date').nullable();
        table.string('contact_email').notNullable();
        table.string('contact_phone_number').notNullable();
        table.integer('donation_counter').unsigned().notNullable().defaultTo(0);
        table.decimal('last_notified_value').notNullable();
        table.integer('interval_notification_value').unsigned().notNullable();
        table.integer('status').notNullable().defaultTo(0);

      })
      .createTable("BankAccounts",function(table)
      {
        table.increments('id').primary();
        table.string('iban', 34).nullable();
        table.string('account_holder').nullable();
        table.string('bank_name').nullable();
      })
      .createTable('CampaignManagers', function(table) 
      {
        table.integer('id').primary().unsigned()
              .references('id').inTable('Users')
              .onDelete('NO ACTION').onUpdate('CASCADE');
              
        table.integer('identification_file_id').nullable().unsigned()
            .references('id').inTable('Files')
            .onDelete('SET NULL').onUpdate('CASCADE');

        table.string('description', 2000).nullable();
        table.string('contact_email').nullable();
        table.boolean("verified").defaultTo(false);
        table.integer('type').unsigned().notNullable().defaultTo(0);
      })
      .createTable('Donors', function(table) {
        table.integer('id').primary().unsigned()
             .references('id').inTable('Users')
             .onDelete('NO ACTION').onUpdate('CASCADE');

        table.integer('donacoins').notNullable().defaultTo(0);
        table.integer('total_donations').notNullable().defaultTo(0);
        table.decimal('total_donated_value',10,2).notNullable().defaultTo(0);
        table.integer('frequency_of_donation').notNullable().defaultTo(0);
        table.dateTime('frequency_of_donation_datetime').nullable();
        table.dateTime('best_frequency_of_donation_datetime').nullable();
      })
      .createTable('StoreItems', function(table) 
      {
        table.integer('id').primary().unsigned();

        table.integer('image_id').unsigned()
          .references('id').inTable('Files')
          .onDelete('NO ACTION').onUpdate('CASCADE');

        table.string('name').notNullable().defaultTo(0);
        table.string('description').notNullable().defaultTo(0);
        table.decimal('cost',10,2).notNullable().defaultTo(0);
      })
      .createTable('UserStoreItems', function(table) 
      {
        table.integer('id').primary().unsigned();

        table.integer('user_id').unsigned()
          .references('id').inTable('Users')
          .onDelete('CASCADE').onUpdate('CASCADE');

        table.integer('store_item_id')
          .references('id').inTable('StoreItems')
          .onDelete('CASCADE').onUpdate('CASCADE');
      })
      .createTable('Donations', function(table) 
      {
        table.integer('id').primary().unsigned();

        table.integer('user_id').unsigned()
          .references('id').inTable('Users')
          .onDelete('NO ACTION').onUpdate('CASCADE');

        table.integer('campaign_id').unsigned()
          .references('id').inTable('Campaigns')
          .onDelete('NO ACTION').onUpdate('CASCADE');

        table.boolean('is_name_hidden').defaultTo(false);
        table.integer('value').unsigned();
        table.string('comment').unsigned();
      })
      .createTable('TotalDonatedValues', function(table) 
      {
        table.integer('id').primary().unsigned();

        table.integer('user_id').unsigned()
          .references('id').inTable('Users')
          .onDelete('NO ACTION').onUpdate('CASCADE');

        table.integer('campaign_id').unsigned()
          .references('id').inTable('Campaigns')
          .onDelete('NO ACTION').onUpdate('CASCADE');

        table.integer('total_value').unsigned();
      })
  };
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists("Addresses")
      .dropTableIfExists('Users')
      .dropTableIfExists('Files')
      .dropTableIfExists('Notifications')
      .dropTableIfExists('Badges')
      .dropTableIfExists('UserBadges')
      .dropTableIfExists('CampaignBadges')
      .dropTableIfExists('Campaigns')
      .dropTableIfExists('BankAccounts')
      .dropTableIfExists('CampaignManagers')
      .dropTableIfExists('Donors')
      .dropTableIfExists('StoreItems')
      .dropTableIfExists('UserStoreItems')
      .dropTableIfExists('Donations')
      .dropTableIfExists('TotalDonatedValues');
};