import { error, json } from "@sveltejs/kit";
import db from "$lib/database";
import type { RequestHandler } from "./$types";

export const PATCH: RequestHandler = async ({ request }) => {
    const body = await request.json();
    console.log(body);
    try {
        await db("ember").where("id", body.id).update({ halal_hely: body.hely });
        return new Response("Success");
    } catch (err: any) {
        console.log(err);
        throw error(409, err.error);
    }
};
