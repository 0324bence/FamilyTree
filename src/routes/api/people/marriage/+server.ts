import { error, json } from "@sveltejs/kit";
import db from "$lib/database";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
    const person = url.searchParams.get("person");
    if (!person) {
        throw error(400);
    }
    const res = await db.raw(
        `Select
            ember.id, ember.vezetek_nev, ember.kereszt_nev,
            ember.isFerfi,
            hazassag.id as hazassag_id,
            hazassag.hely as hazassag_hely_id,	hazassag.ido as hazassag_ido,
            CONCAT((Select nev from orszag where id = hazassaghely.orszag), ', ', hazassaghely.megye, ', ', hazassaghely.iranyitoszam, ' ',  hazassaghely.helyseg) as hazassag_hely
            from ember
            Left Join hazassag_link as hlink ON hlink.ember = ember.id
            LEFT Join hazassag on hlink.hazassag = hazassag.id
            left Join hely as hazassaghely On hazassaghely.iranyitoszam = hazassag.hely
            left Join hazassag_link as partners On hazassag.id = partners.hazassag AND partners.ember <> ember.id
            WHERE ${person} = ANY (
                Select 
                hazassag_link.ember from hazassag_link
                where hazassag_link.hazassag = hazassag.id
            ) AND ember.id <> ${person}
            GROUP BY ember.id, hlink.id, hazassag.id, hazassaghely.iranyitoszam
            order by ember.id`
    );

    return json(res.rows);
};

// TODO post
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
        console.log(err);
        throw error(409, err.message);
    }
}) satisfies RequestHandler;

//TODO delete
export const DELETE = (async ({ request }) => {
    const body = await request.json();
    try {
        await db.raw(`
            UPDATE ember SET szül_hely = NULL WHERE szül_hely = '${body.iranyitoszam}'
        `);
        await db.raw(`
            UPDATE halal SET hely = NULL WHERE hely = '${body.iranyitoszam}'
        `);
        await db.raw(`
            UPDATE hazassag SET hely = NULL WHERE hely = '${body.iranyitoszam}'
        `);
        await db("hely").where("iranyitoszam", body.iranyitoszam).del();
        return new Response("Success");
    } catch (err: any) {
        console.log(err);
        throw error(409, err.message);
    }
}) satisfies RequestHandler;
