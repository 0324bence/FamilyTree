import { error, json } from "@sveltejs/kit";
import db from "$lib/database";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    const res = await db.raw(
        `Select
        hazassag.id,
        CONCAT((Select nev from orszag where id = hazassaghely.orszag), ', ', hazassaghely.megye, ', ', hazassaghely.iranyitoszam, ' ',  hazassaghely.helyseg) as hely,
        hazassag.ido,
        (Select Concat(vezetek_nev, ' ', kereszt_nev) from ember where id = MAX(hazassag_link.ember)) as ember1,
        (Select Concat(vezetek_nev, ' ', kereszt_nev) from ember where id = MIN(hazassag_link.ember)) as ember2,
        COUNT(hazassag_link.ember) as members
        from hazassag
        left join hazassag_link on hazassag.id = hazassag_link.hazassag
        left join hazassag_link as hlink on hazassag.id = hlink.hazassag AND hazassag_link.ember <> hlink.ember
        left Join hely as hazassaghely On hazassaghely.iranyitoszam = hazassag.hely
        group by hazassag.id, hazassaghely.iranyitoszam
        order by hazassag.id`
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
        await db("hazassag").insert([
            {
                hely: body.hely,
                ido: body.ido
            }
        ]);
        return new Response("Success");
    } catch (err: any) {
        console.log(err);
        throw error(409, err.message);
    }
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
    const body = await request.json();
    try {
        db("hazassag_link").where("hazassag", body.id).del();
        db("hazassag").where("id", body.id).del();
        return new Response("Success");
    } catch (err: any) {
        console.log(err);
        throw error(409, err.message);
    }
}) satisfies RequestHandler;
