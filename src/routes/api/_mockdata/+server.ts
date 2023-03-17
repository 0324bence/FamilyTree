import { json } from "@sveltejs/kit";
import db from "$lib/database";
//import type { RowDataPacket } from "mysql2";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    await db.raw("Insert into Orszag (nev) values ('Magyarország');");
    await db.raw(
        "insert into Hely (iranyitoszam, orszag, megye, helyseg) values ('6100',1,'Bács-kiskun vármegye','Kiskunfélegyháza');"
    );
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, isFerfi) values ('József', 'Doe', '6100', '1964-04-22', TRUE);"
    );
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, isFerfi) values ('Józsefné Katalin', 'Doe', '6100', '1964-06-22', FALSE);"
    );
    await db.raw("insert into hazassag (hely, ido) values ('6100', '1885-08-10');");
    await db.raw("insert into Hazassag_link (ember, hazassag) values (1, 1);");
    await db.raw("insert into Hazassag_link (ember, hazassag) values (2, 1);");
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, foglalkozas, isFerfi) values ('II. József', 'Doe', '6100', '1987-07-02', 1, 2, 'Tanár', TRUE);"
    );
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, foglalkozas, isFerfi) values ('Józsefné Marika', 'Doe', '6100', '1988-07-02', 'Tanár', FALSE);"
    );
    await db.raw("insert into hazassag (hely, ido) values ('6100', '2004-08-10');");
    await db.raw("insert into Hazassag_link (ember, hazassag) values (3, 2);");
    await db.raw("insert into Hazassag_link (ember, hazassag) values (4, 2);");
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, foglalkozas, isFerfi) values ('Kelemen', 'Doe', '6100', '1989-11-02', 1, 2, 'Kőműves', TRUE);"
    );
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, foglalkozas, isFerfi) values ('Kelemenné', 'Doe', '6100', '1991-08-17', 'Beépített ember', FALSE);"
    );
    await db.raw("insert into hazassag (hely, ido) values ('6100', '2008-08-10');");
    await db.raw("insert into Hazassag_link (ember, hazassag) values (5, 3);");
    await db.raw("insert into Hazassag_link (ember, hazassag) values (6, 3);");
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, isFerfi) values ('III. József', 'Doe', '6100', '2012-01-30', 3, 4,  TRUE);"
    );
    await db.raw(
        "insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, isFerfi) values ('Kelemenke', 'Doe', '6100', '2007-01-30', 5, 6,  TRUE);"
    );

    return new Response(String("Success"));
};
