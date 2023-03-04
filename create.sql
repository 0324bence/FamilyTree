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
    FOREIGN KEY (szül_hely) REFERENCES Hely(iranyitoszam)
);

Alter table Ember
    ADD FOREIGN KEY (apja) REFERENCES Ember(id),
    ADD FOREIGN KEY (anyja) REFERENCES Ember(id)

--- TODO Halál