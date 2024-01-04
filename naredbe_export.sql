COPY (
    SELECT array_to_json(array_agg(row_to_json(t))) FROM (
        SELECT 
            borci.ime,
			borci.prezime,
			rekord,
			datum_rođenja,
			preciznost_značajnih_udaraca,
		    broj_značajnih_udaraca_po_minuti,
			preciznost_rušenja,
			broj_rušenja_po_minuti,

            COALESCE(json_agg(
                        json_build_object(
                            'protivnik', protivnik_ime || ' ' || protivnik_prezime, 
                            'rezultat', rezultat, 'datum_borbe', datum_borbe
						)	
					), '[]'
			) AS prethodne_borbe

        FROM borci join borbe on (
			borci.ime = borbe.ime and
			borci.prezime = borbe.prezime and
			datum_borbe = datum_prethodne_borbe)
		GROUP BY borci.ime, borci.prezime, rekord, datum_rođenja, 
			preciznost_značajnih_udaraca,
		    broj_značajnih_udaraca_po_minuti,
			preciznost_rušenja,
			broj_rušenja_po_minuti
        ) t ) 

TO 'D://UFC_borci.json';

COPY (
    SELECT borci.*, protivnik_ime,protivnik_prezime, rezultat FROM borci JOIN borbe ON (
	borci.ime = borbe.ime AND
	borci.prezime = borbe.prezime AND
	datum_borbe = datum_prethodne_borbe)
) 
TO 'D://UFC_borci.csv' WITH DELIMITER ',' CSV HEADER;