import { error, json } from "@sveltejs/kit";
import db from "$lib/database";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    const res = await db.select("id", "nev").from("orszag");
    return json(res);
};

export const POST = (async ({ request }) => {
    const body = await request.json();
    try {
        await db("hely").insert([
            {
                iranyitoszam: body.iranyitoszam,
                orszag: body.orszag,
                megye: body.megye,
                helyseg: body.helyseg
            }
        ]);
        return new Response("Success");
    } catch (err: any) {
        throw error(409, err.message);
    }
}) satisfies RequestHandler;
