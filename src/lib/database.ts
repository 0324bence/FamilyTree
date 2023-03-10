import mysql from "mysql2/promise";
import { env } from "$env/dynamic/private";

let conn = await mysql.createConnection(env.DATABASE_URL);

await conn.execute("Create database if not exists `familytree`");

conn = await mysql.createConnection(env.DATABASE_URL + "/familytree");

export default conn;
