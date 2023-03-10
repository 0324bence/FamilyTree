import knex, { Knex } from "knex";
import { env } from "$env/dynamic/private";
import { NODE_ENV } from "$env/static/private";

let conn: Knex;

if (NODE_ENV == "development") {
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
        connection: env.DATABASE_URL
    });
}

export default conn;
