import knex from "knex";
import type { Knex } from "knex";
import { env } from "$env/dynamic/private";
import { MYSQL } from "$env/static/private";

let conn: Knex;

console.log(MYSQL);

if (MYSQL == "true") {
    console.log("dev mode");
    conn = knex({
        client: "mysql",
        connection: {
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "familytree"
        }
    });
} else {
    conn = knex({
        client: "pg",
        connection: env.DATABASE_URL,
        searchPath: ["knex", "public"]
    });
}

export default conn;
