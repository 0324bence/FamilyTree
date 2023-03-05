Create Table IF not exists Orszag (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nev VARCHAR(20) NOT NULL
);

Create Table IF not exists Hely (
    iranyitoszam VARCHAR(10) NOT NULL PRIMARY KEY,
    orszag INT NOT NULL,
    megye VARCHAR(20) NOT NULL,
    helyseg VARCHAR(20) NOT NULL,
    FOREIGN KEY (orszag) REFERENCES Orszag(id)
);

Create Table IF not exists Halal (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    hely VARCHAR(10),
    ido DATE NOT NULL,
    ok VARCHAR(50),
    FOREIGN KEY (hely) REFERENCES Hely(iranyitoszam)
);

Create Table IF Not exists Ember (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    kereszt_nev VARCHAR(20) NOT NULL,
    vezetek_nev VARCHAR(20) NOT NULL,
    szül_hely VARCHAR(10),
    szül_ido DATE NOT NULL,
    apja INT,
    anyja INT,
    foglalkozas VARCHAR(20) NOT NULL DEFAULT "Munkanélküli",
    isFerfi BOOLEAN,
    halal INT,
    FOREIGN KEY (szül_hely) REFERENCES Hely(iranyitoszam),
    FOREIGN KEY (halal) REFERENCES Halal(id)
);

Create Table If not exists Hazassag (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    ember1 INT NOT NULL,
    ember2 INT NOT NULL,
    hely VARCHAR(10),
    ido DATE,
    FOREIGN KEY (hely) REFERENCES Hely(iranyitoszam),
    FOREIGN KEY (ember1) REFERENCES Ember(id),
    FOREIGN KEY (ember2) REFERENCES Ember(id)
);

Create Table if not exists Hazassag_link (
    ember INT NOT NULL,
    hazassag INT NOT NULL,
    FOREIGN KEY (ember) REFERENCES Ember(id),
    FOREIGN KEY (hazassag) REFERENCES Hazassag(id)
);

Alter table Ember
    ADD FOREIGN KEY (apja) REFERENCES Ember(id),
    ADD FOREIGN KEY (anyja) REFERENCES Ember(id)