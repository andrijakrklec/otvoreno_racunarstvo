COPY (
  SELECT 
    array_to_json(
      array_agg(
        row_to_json(t)
      )
    ) 
  FROM 
    (
      SELECT 
        borci.id,
		borci.ime, 
        borci.prezime, 
        borci.rekord, 
        borci.datum_rođenja, 
        borci.preciznost_značajnih_udaraca, 
        borci.broj_značajnih_udaraca_po_minuti, 
        borci.preciznost_rušenja, 
        borci.broj_rušenja_po_minuti, 
        COALESCE(
          json_agg(
            json_build_object(
              'protivnik', b.ime || ' ' || b.prezime, 
              'rezultat', rezultat, 'datum_borbe', 
              datum_borbe
            )
          ), 
          '[]'
        ) AS prethodne_borbe 
      FROM 
        borci 
        join borbe on (
          borci.id = borbe.id 
        ) 
        join borci b on (b.id = borbe.protivnik_id) 
      GROUP BY 
        borci.id, 
        borci.ime, 
        borci.prezime, 
        borci.rekord, 
        borci.datum_rođenja, 
        borci.preciznost_značajnih_udaraca, 
        borci.broj_značajnih_udaraca_po_minuti, 
        borci.preciznost_rušenja, 
        borci.broj_rušenja_po_minuti
    ) t
) TO 'D://podaci.txt';
COPY (
  SELECT 
    borci.id, 
    borci.ime, 
    borci.prezime, 
    borci.rekord, 
    borci.datum_rođenja, 
    borci.preciznost_značajnih_udaraca, 
    borci.broj_značajnih_udaraca_po_minuti, 
    borci.preciznost_rušenja, 
    borci.broj_rušenja_po_minuti, 
    b.ime protivnik_ime, 
    b.prezime protivnik_prezime, 
	borbe.datum_borbe,
    rezultat 
  from 
    borci 
    join borbe on (
      borci.id = borbe.id 
    ) 
    join borci b on (b.id = borbe.protivnik_id)
) TO 'D://podaci.csv' WITH DELIMITER ',' CSV HEADER;
