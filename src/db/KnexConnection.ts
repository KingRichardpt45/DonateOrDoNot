import knexConfig from "@/../knexfile.js"
import { Knex } from "knex";

import knex from "knex";

export const dbConnection : Knex = knex(knexConfig["development"]);
