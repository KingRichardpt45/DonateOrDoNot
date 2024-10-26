// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/db/DonatOrDoNotdev_DB.sqlite3'
    },
    migrations: {
      tableName: "migrations",
      directory: './src/db/migrations'
    },
    seeds: {
      tableName: 'seeds',
      directory: "./src/db/seeds"
    }
  },

  // staging: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './DonatOrDoNotdev_DB.sqlite3'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'migrations'
  //   }
  // },

  // production: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './db/DonatOrDoNotdev_DB.sqlite3'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: './db/migrations'
  //   },
  //   seeds: {
  //     tableName: './db/seeds'
  //   }
  // }

};
