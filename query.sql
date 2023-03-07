Select
ember.vezetek_nev, ember.kereszt_nev, (szulhely.orszag + ", " + szulhely.megye + ", " + szulhely.iranyitoszam + " " +  szulhely.helyseg) as szül_hely, ember.szül_ido, ember.apja, ember.anyja, ember.foglalkozas, ember.isFerfi,
hlink2.ember as partner_id,	hazassag.ido as hazassag_ido, (hazassaghely.orszag + ", " + hazassaghely.megye + ", " + hazassaghely.iranyitoszam + " " +  hazassaghely.helyseg) as hazassag_hely,
halal.ido as halal_ido, halal.ok as halal_ok, (halalhely.orszag + ", " + halalhely.megye + ", " + halalhely.iranyitoszam + " " +  halalhely.helyseg) as halal_hely
from ember 
Join hazassag_link as hlink ON hlink.ember = ember.id
Join hazassag_link as hlink2 on hlink.hazassag = hlink2.hazassag AND hlink2.ember != ember.id
Join halal on ember.halal = halal.id
Join hazassag on hlink.hazassag = hazassag.id
Join hely as szulhely On szulhely.iranyitoszam = ember.szül_hely
Join hely as hazassaghely On hazassaghely.iranyitoszam = hazassag.hely
Join hely as halalhely On halalhely.iranyitoszam = halal.hely