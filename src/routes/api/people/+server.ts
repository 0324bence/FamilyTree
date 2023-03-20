import { json } from "@sveltejs/kit";
import db from "$lib/database";
//import type { RowDataPacket } from "mysql2";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    // const res = await db.select("*").from("ember");
    // TODO postrge cannot concat
    const res = await db.raw(
        `Select
        ember.id, ember.vezetek_nev, ember.kereszt_nev, CONCAT((Select nev from orszag where id = szulhely.orszag), ', ', szulhely.megye, ', ', szulhely.iranyitoszam, ' ',  szulhely.helyseg) as szül_hely, ember.szül_ido, ember.apja, ember.anyja, ember.foglalkozas, ember.isFerfi, ember.szül_hely as szül_hely_id, halal.hely as halal_hely_id, hazassag.hely as hazassag_hely_id,
        hlink2.ember as partner_id,	hazassag.ido as hazassag_ido, CONCAT((Select nev from orszag where id = hazassaghely.orszag), ', ', hazassaghely.megye, ', ', hazassaghely.iranyitoszam, ' ',  hazassaghely.helyseg) as hazassag_hely,
        halal.ido as halal_ido, halal.ok as halal_ok, CONCAT((Select nev from orszag where id = halalhely.orszag), ', ', halalhely.megye, ', ', halalhely.iranyitoszam, ' ', halalhely.helyseg) as halal_hely
        from ember
        Left Join hazassag_link as hlink ON hlink.ember = ember.id
        left Join hazassag_link as hlink2 on hlink.hazassag = hlink2.hazassag AND hlink2.ember != ember.id
        left Join halal on ember.halal = halal.id
        LEFT Join hazassag on hlink.hazassag = hazassag.id
        left Join hely as szulhely On szulhely.iranyitoszam = ember.szül_hely
        left Join hely as hazassaghely On hazassaghely.iranyitoszam = hazassag.hely
        left Join hely as halalhely On halalhely.iranyitoszam = halal.hely`
    );
    return json(res);
};

export const PATCH = (async ({ request }) => {
    const body = await request.json();
    await db("ember")
        .where("id", body.id)
        .update({
            vezetek_nev: body.vezetek_nev,
            kereszt_nev: body.kereszt_nev,
            foglalkozas: body.foglalkozas || "Munkanélküli"
        });

    return new Response("Success");
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
    const body = await request.json();
    // await db("ember")
    //     .where("id", body.id)
    //     .update({
    //         vezetek_nev: body.vezetek_nev,
    //         kereszt_nev: body.kereszt_nev,
    //         foglalkozas: body.foglalkozas || "Munkanélküli"
    //     });
    await db("ember").insert({
        ...body
    });

    return new Response("Success");
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
    const body = await request.json();
    // await db("ember")
    //     .where("id", body.id)
    //     .update({
    //         vezetek_nev: body.vezetek_nev,
    //         kereszt_nev: body.kereszt_nev,
    //         foglalkozas: body.foglalkozas || "Munkanélküli"
    //     });
    await db("ember").where("apja", body.id).update({ apja: null });
    await db("ember").where("anyja", body.id).update({ anyja: null });
    await db("hazassag_link").where("ember", body.id).del();
    await db("ember").where("id", body.id).del();

    return new Response("Success");
}) satisfies RequestHandler;
