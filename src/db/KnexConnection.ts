import knexConfig from "@/../knexfile.js"
import knex, {Knex} from "knex";

export const dbConnection: Knex = knex(knexConfig["development"]);
