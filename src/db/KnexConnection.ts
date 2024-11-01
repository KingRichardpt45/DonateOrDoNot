import knexConfig from "@/../knexfile.js"
import { Knex } from "knex";

export const dbConnection : Knex = require('knex')(knexConfig["development"]);
