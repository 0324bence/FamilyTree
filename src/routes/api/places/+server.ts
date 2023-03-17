import { json } from "@sveltejs/kit";
import db from "$lib/database";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    // const res = await db.select("*").from("ember");
    // TODO postrge cannot concat
    const countries = await db.select("id", "nev").from("orszag");
    const places = await db.select("*").from("hely");

    for (let i = 0; i < places.length; i++) {
        places[i].display = places[i].megye + ", " + places[i].iranyitoszam + " " + places[i].helyseg;
    }

    const res = {
        countries,
        places
    };
    return json(res);
};
