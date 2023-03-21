import db from "$lib/database";
import { MYSQL } from "$env/static/private";

async function create() {
    if (MYSQL == "true") {
        await db.schema.raw(
            "Create Table IF not exists Orszag ( id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, nev VARCHAR(20) NOT NULL )"
        );
        await db.schema.raw(
            "Create Table IF not exists Hely (iranyitoszam VARCHAR(10) NOT NULL PRIMARY KEY, orszag INT NOT NULL, megye VARCHAR(40) NOT NULL, helyseg VARCHAR(40) NOT NULL, FOREIGN KEY (orszag) REFERENCES Orszag(id))"
        );
        await db.schema.raw(
            "Create Table IF Not exists Ember (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,kereszt_nev VARCHAR(20) NOT NULL,vezetek_nev VARCHAR(20) NOT NULL,szül_hely VARCHAR(10),szül_ido DATE NOT NULL,apja INT,anyja INT, foglalkozas VARCHAR(20) NOT NULL DEFAULT 'Munkanélküli',isFerfi BOOLEAN, halal_hely VARCHAR(10), halal_ido DATE NOT NULL, halal_ok VARCHAR(250), FOREIGN KEY (halal_hely) REFERENCES Hely(iranyitoszam), FOREIGN KEY (szül_hely) REFERENCES Hely(iranyitoszam))"
        );
        await db.schema.raw(
            "Create Table If not exists Hazassag (id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,hely VARCHAR(10),ido DATE,FOREIGN KEY (hely) REFERENCES Hely(iranyitoszam))"
        );
        await db.schema.raw(
            "Create Table if not exists Hazassag_link (ember INT NOT NULL,hazassag INT NOT NULL,FOREIGN KEY (ember) REFERENCES Ember(id),FOREIGN KEY (hazassag) REFERENCES Hazassag(id))"
        );
        await db.schema.raw(
            "Alter table Ember ADD FOREIGN KEY (apja) REFERENCES Ember(id), ADD FOREIGN KEY (anyja) REFERENCES Ember(id)"
        );
    } else {
        console.log("Not SQL");
        await db.schema.raw(
            "Create Table IF not exists Orszag ( id SERIAL NOT NULL PRIMARY KEY, nev VARCHAR(20) NOT NULL )"
        );
        await db.schema.raw(
            "Create Table IF not exists Hely (iranyitoszam VARCHAR(10) NOT NULL PRIMARY KEY, orszag INT NOT NULL, megye VARCHAR(40) NOT NULL, helyseg VARCHAR(40) NOT NULL, FOREIGN KEY (orszag) REFERENCES Orszag(id))"
        );
        await db.schema.raw(
            "Create Table IF not exists Halal (id SERIAL NOT NULL PRIMARY KEY,hely VARCHAR(10),ido DATE NOT NULL,ok VARCHAR(250),FOREIGN KEY (hely) REFERENCES Hely(iranyitoszam))"
        );
        await db.schema.raw(
            "Create Table IF Not exists Ember (id SERIAL NOT NULL PRIMARY KEY,kereszt_nev VARCHAR(20) NOT NULL,vezetek_nev VARCHAR(20) NOT NULL,szül_hely VARCHAR(10),szül_ido DATE NOT NULL,apja INT,anyja INT,foglalkozas VARCHAR(20) NOT NULL DEFAULT 'Munkanélküli',isFerfi BOOLEAN,halal INT,FOREIGN KEY (szül_hely) REFERENCES Hely(iranyitoszam),FOREIGN KEY (halal) REFERENCES Halal(id))"
        );
        await db.schema.raw(
            "Create Table If not exists Hazassag (id SERIAL NOT NULL PRIMARY KEY,hely VARCHAR(10),ido DATE,FOREIGN KEY (hely) REFERENCES Hely(iranyitoszam))"
        );
        await db.schema.raw(
            "Create Table if not exists Hazassag_link (ember INT NOT NULL,hazassag INT NOT NULL,FOREIGN KEY (ember) REFERENCES Ember(id),FOREIGN KEY (hazassag) REFERENCES Hazassag(id))"
        );
    }
}

export default create;
