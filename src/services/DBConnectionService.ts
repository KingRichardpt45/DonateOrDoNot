import {knexConfig} from '@/../knexfile.js';
import {Knex, knex} from "knex";

/**
 * This class connects and provides the knex connection of a provider environment configuration.
 */
export class DBConnectionService {
    /**
     * The connection.
     */
    public readonly dbConnection: Knex;

    /**
     * Creates a DBConnectionService based on the provided environment name.
     *
     * @param {string} environment The name of the environment.
     */
    constructor(environment: string) {
        this.dbConnection = knex(knexConfig[environment]);
    }
}