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
    if (res.rows) {
        return json(res.rows);
    } else {
        return json(res);
    }
};

export const POST = (async ({ request }) => {
    const body = await request.json();
    try {
        await db("hazassag_link").insert([
            {
                ember: body.ember,
                hazassag: body.hazassag
            }
        ]);
        await db.raw(
            `Delete from hazassag where (
                SELECT COUNT(*) from hazassag_link where hazassag.id = hazassag_link.hazassag
            ) = 0`
        );
        return new Response("Success");
    } catch (err: any) {
        console.log(err);
        throw error(409, err.message);
    }
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
    const body = await request.json();
    try {
        await db("hazassag_link").where("ember", body.ember).andWhere("hazassag", body.id).del();
        await db.raw(
            `Delete from hazassag where (
                SELECT COUNT(*) from hazassag_link where hazassag.id = hazassag_link.hazassag
            ) = 0`
        );
        return new Response("Success");
    } catch (err: any) {
        console.log(err);
        throw error(409, err.message);
    }
}) satisfies RequestHandler;
