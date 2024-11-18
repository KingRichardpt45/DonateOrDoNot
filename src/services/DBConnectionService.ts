import { knexConfig } from '@/../knexfile.js';
import { Knex } from "knex";

export class DBConnectionService
{
    public readonly dbConnection : Knex;

    constructor(enticement:string)
    {
        this.dbConnection = require('knex')(knexConfig["development"]);
    }
}