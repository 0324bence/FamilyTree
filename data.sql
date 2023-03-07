Insert into Orszag
values (1, "Magyarország");

insert into Hely
values ("6100",1,"Bács-kiskun vármegye","Kiskunfélegyháza");

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, isFerfi)
values ("József", "Doe", "6100", "1964-04-22", TRUE);

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, isFerfi)
values ("Józsefné Katalin", "Doe", "6100", "1964-06-22", FALSE);

insert into hazassag
values ("6100", "1885-08-10");

insert into Hazassag_link
values (1, 1);

insert into Hazassag_link
values (2, 1);

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, foglalkozas isFerfi)
values ("II. József", "Doe", "6100", "1987-07-02", 1, 2, "Tanár", TRUE);

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, foglalkozas isFerfi)
values ("Józsefné Marika", "Doe", "6100", "1988-07-02", "Tanár", FALSE);

insert into hazassag
values ("6100", "2004-08-10");

insert into Hazassag_link
values (3, 2);

insert into Hazassag_link
values (4, 2);

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, foglalkozas isFerfi)
values ("Kelemen", "Doe", "6100", "1989-11-02", 1, 2, "Kőműves", TRUE);

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, foglalkozas isFerfi)
values ("Kelemenné", "Doe", "6100", "1991-08-17", "Beépített ember", FALSE);

insert into hazassag
values ("6100", "2008-08-10");

insert into Hazassag_link
values (5, 3);

insert into Hazassag_link
values (6, 3);

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, foglalkozas isFerfi)
values ("III. József", "Doe", "6100", "2012-01-30", 3, 4,  TRUE);

insert into ember (kereszt_nev, vezetek_nev, szül_hely, szül_ido, apja, anyja, foglalkozas isFerfi)
values ("Kelemenke", "Doe", "6100", "2007-01-30", 5, 6,  TRUE);