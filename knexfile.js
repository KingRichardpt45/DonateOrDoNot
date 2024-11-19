/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const knexConfig = {

  development: {
    client: 'sqlite3',
    connection: {
      filename:  './src/db/DonateOrDoNotdev_DB.sqlite3', 
    },
    migrations: {
      tableName: 'migrations',
      directory: './src/db/migrations',
    },
    seeds: {
      tableName: 'seeds',
      directory: './src/db/seeds',
    },
    useNullAsDefault:true,
    pool:{
      min: 2,
      max: 10
    }
  },
};

export default knexConfig;