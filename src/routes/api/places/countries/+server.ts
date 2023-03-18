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
        await db("orszag").insert([
            {
                nev: body.nev
            }
        ]);
        // await db("hely").insert([
        //     {
        //         iranyitoszam: body.iranyitoszam,
        //         orszag: body.orszag,
        //         megye: body.megye,
        //         helyseg: body.helyseg
        //     }
        // ]);
        return new Response("Success");
    } catch (err: any) {
        throw error(409, err.message);
    }
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
    const body = await request.json();
    try {
        await db.raw(`
            UPDATE ember SET szül_hely = NULL WHERE szül_hely = ANY (Select iranyitoszam from hely where orszag = ${body.id})
        `);
        await db.raw(`
            UPDATE halal SET hely = NULL WHERE hely = ANY (Select iranyitoszam from hely where orszag = ${body.id})
        `);
        await db.raw(`
            UPDATE hazassag SET hely = NULL WHERE hely = ANY (Select iranyitoszam from hely where orszag = ${body.id})
        `);
        await db("hely").where("orszag", body.id).del();
        await db("orszag").where("id", body.id).del();
        // await db("hely").insert([
        //     {
        //         iranyitoszam: body.iranyitoszam,
        //         orszag: body.orszag,
        //         megye: body.megye,
        //         helyseg: body.helyseg
        //     }
        // ]);
        return new Response("Success");
    } catch (err: any) {
        console.log(err);
        throw error(409, err.message);
    }
}) satisfies RequestHandler;
