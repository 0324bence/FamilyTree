import { json } from "@sveltejs/kit";
import db from "$lib/database";
//import type { RowDataPacket } from "mysql2";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    const res = await db.select("*").from("ember");
    return json(res);
};
