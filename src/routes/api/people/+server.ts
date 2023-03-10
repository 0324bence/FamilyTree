import { json } from "@sveltejs/kit";
import db from "$lib/database";
import type { RowDataPacket } from "mysql2";
import type { RequestHandler } from "./$types";

export const get: RequestHandler = async () => {
    const res = (await db.query("Select * from familytree.ember")) as RowDataPacket;
    let output = "";
    for (const i of res[0]) {
        output += i.kereszt_nev + "\n";
    }
    return new Response(String(output));
};
