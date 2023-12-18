var pg = require("pg");
var HTTPError = require("../utilities/errorWrapper.js");

var poolVar = null;

const pool = function () {
  if (poolVar === null)
    poolVar = new pg.Pool({
      user: "postgres",
      host: "localhost",
      database: "UFC_borci",
      password: "bazepodataka",
      port: 5432,
    });
  return poolVar;
};

async function getAll() {
  var tmp = await pool()
    .query(
      `SELECT 
      borci.id, 
      borci.ime, 
      borci.prezime, 
      borci.rekord, 
      borci.datum_rođenja, 
      borci.preciznost_značajnih_udaraca, 
      borci.broj_značajnih_udaraca_po_minuti, 
      borci.preciznost_rušenja, 
      borci.broj_rušenja_po_minuti,
      b.id protivnik_id, 
      b.ime protivnik_ime, 
      b.prezime protivnik_prezime, 
      borbe.datum_borbe,
      rezultat 
    FROM 
      borci 
      LEFT JOIN borbe ON (
        borci.id = borbe.id 
      ) 
      LEFT JOIN borci b ON (b.id = borbe.protivnik_id)
      `
    )
    .then((result) => {
      return transformToJSON(result.rows);
    })
    .catch((err) => {
      throw new HTTPError("500", "Error connecting to database");
    });
  return tmp;
}

async function getFightersBrief() {
  let tmp = await getAll().catch((e) => {
    throw new HTTPError(e.errorCode, e.message);
  });

  return tmp.map((fighter) => {
    let id = fighter.id;
    let ime = fighter.ime;
    let prezime = fighter.prezime;
    let links = [
      {
        href: `/fighters/${fighter.id}`,
        rel: "fighter",
        type: "GET",
      },
    ];
    return { id, ime, prezime, links };
  });
}

async function getId(id) {
  var tmp = await pool()
    .query(
      `SELECT 
        borci.id, 
        borci.ime, 
        borci.prezime, 
        borci.rekord, 
        borci.datum_rođenja, 
        borci.preciznost_značajnih_udaraca, 
        borci.broj_značajnih_udaraca_po_minuti, 
        borci.preciznost_rušenja, 
        borci.broj_rušenja_po_minuti, 
        b.id protivnik_id, 
        b.ime protivnik_ime, 
        b.prezime protivnik_prezime, 
        borbe.datum_borbe,
        rezultat 
      FROM 
        borci 
        LEFT JOIN borbe ON (
          borci.id = borbe.id 
        ) 
        LEFT JOIN borci b ON (b.id = borbe.protivnik_id)
      WHERE borci.id = ${id}  
        `
    )
    .then((result) => {
      return transformToJSON(result.rows);
    })
    .catch((err) => {
      throw new HTTPError("500", "Error connecting to database");
    });
  return tmp;
}

async function putObject(object) {
  try {
    object.id = parseInt(object.id);
    if (isNaN(object.id)) {
      throw new HTTPError("422", "Invalid fighter id!");
    }
  } catch (e) {
    throw new HTTPError(e.errorCode, e.message);
  }
  let tmpObject = await getId(object.id);
  if (tmpObject.length > 0) {
    if (
      object.prethodne_borbe !== undefined &&
      object.prethodne_borbe.length > 0
    )
      await Promise.all(
        object.prethodne_borbe.map(async (x) => {
          try {
            let id = await checkIfExists(x.protivnik); //id novog protivnika
            if (id !== null) {
              let rows = await pool()
                .query(
                  `SELECT * FROM borbe
                WHERE id = ${object.id} AND 
                (protivnik_id = ${id} AND  datum_borbe <> '${x.datum_borbe}' OR
                protivnik_id <> ${id} AND  datum_borbe = '${x.datum_borbe}' OR
                protivnik_id = ${id} AND  datum_borbe = '${x.datum_borbe}' AND rezultat <> '${x.rezultat}'
                )
                `
                )
                .then((result) => {
                  return result.rows;
                });

              await pool()
                .query(
                  `
                UPDATE borbe SET
                protivnik_id = ${id},
                datum_borbe = '${x.datum_borbe}',
                rezultat = '${x.rezultat}'
                WHERE id = ${object.id} AND 
                (protivnik_id = ${id} AND  datum_borbe <> '${x.datum_borbe}' OR
                protivnik_id <> ${id} AND  datum_borbe = '${x.datum_borbe}' OR
                protivnik_id = ${id} AND  datum_borbe = '${x.datum_borbe}' AND rezultat <> '${x.rezultat}'
                )
                `
                )
                .catch((e) => {
                  console.log(e);
                  throw new HTTPError(
                    "400",
                    "Error while updating values in database!"
                  );
                });

              if (rows.length == 0) {
                let alreadyExists = await pool()
                  .query(
                    `SELECT COUNT(*) FROM borbe WHERE protivnik_id=${id} AND datum_borbe='${x.datum_borbe}' AND rezultat='${x.rezultat}'`
                  )
                  .then((result) => {
                    return result.rows;
                  });
                if (parseInt(alreadyExists[0]["count"]) > 0)
                  console.log("Already exists!!!");
                // add new fight
                else
                  await pool()
                    .query(
                      `
                    INSERT INTO borbe(id, protivnik_id, datum_borbe, rezultat) VALUES(${object.id}, ${id}, '${x.datum_borbe}', '${x.rezultat}')
                    `
                    )
                    .catch((e) => {
                      console.log(e);
                      throw new HTTPError(
                        "400",
                        "Error while updating values in database!"
                      );
                    });
              }
            } else {
              throw new HTTPError("404", "Opponent does not exist!");
            }
          } catch (e) {
            throw new HTTPError(e.errorCode, e.message);
          }
        })
      ).catch((e) => {
        throw new HTTPError(e.errorCode, e.message);
      });
    let queryString = ``;
    queryString += object.ime !== undefined ? `ime = '${object.ime}',` : ``;
    queryString +=
      object.rekord !== undefined ? `rekord = '${object.rekord}',` : ``;
    queryString +=
      object.prezime !== undefined ? `prezime = '${object.prezime}',` : ``;
    queryString +=
      object.datum_rođenja !== undefined
        ? `datum_rođenja = '${object.datum_rođenja}',`
        : ``;
    queryString +=
      object.preciznost_značajnih_udaraca !== undefined
        ? `preciznost_značajnih_udaraca = '${object.preciznost_značajnih_udaraca}',`
        : ``;
    queryString +=
      object.broj_značajnih_udaraca_po_minuti !== undefined
        ? `broj_značajnih_udaraca_po_minuti = '${object.broj_značajnih_udaraca_po_minuti}',`
        : ``;
    queryString +=
      object.preciznost_rušenja !== undefined
        ? `preciznost_rušenja = '${object.preciznost_rušenja}',`
        : ``;
    queryString +=
      object.broj_rušenja_po_minuti !== undefined
        ? `broj_rušenja_po_minuti = '${object.broj_rušenja_po_minuti}',`
        : ``;
    queryString = queryString.slice(0, -1); //remove last comma
    if (queryString.length > 0)
      await pool()
        .query(
          `UPDATE borci SET
                  ${queryString}
                  WHERE id = ${object.id}
                  `
        )
        .catch((e) => {
          console.log(e);
          throw new HTTPError(
            "400",
            "Error while updating values in database!"
          );
        });
    return;
  } else {
    throw new HTTPError("204", "Fighter does not exist!");
  }
}

async function postObject(object) {
  // ime i prezime nisu identifikator, vec se sam generira, nije potrebno provjeravati postoji li element u bazi !!!
  var db;
  try {
    db = await pool().connect();
  } catch (e) {
    throw new HTTPError("500", "Error connecting to database");
  }
  var generatedId;
  try {
    await db.query("BEGIN");

    generatedId = await db
      .query(
        `
      INSERT INTO borci(ime, 
                        prezime, 
                        rekord,
                        datum_rođenja, 
                        preciznost_značajnih_udaraca, 
                        broj_značajnih_udaraca_po_minuti,
                        preciznost_rušenja, 
                        broj_rušenja_po_minuti) VALUES(
                          '${object.ime}',
                          '${object.prezime}',
                          '${object.rekord}',
                          '${object.datum_rođenja}', 
                          '${object.preciznost_značajnih_udaraca}',
                          ${object.broj_značajnih_udaraca_po_minuti},
                          '${object.preciznost_rušenja}',
                          ${object.broj_rušenja_po_minuti}
        )
        RETURNING id
      `
      )
      .then((result) => {
        return parseInt(result.rows[0]["id"]);
      })
      .catch((err) => {
        throw new HTTPError("400", "Error while adding fighter to database!");
      });
    if (object.prethodne_borbe !== undefined)
      await Promise.all(
        object.prethodne_borbe.map(async (x) => {
          try {
            let id = await checkIfExists(x.protivnik); //id novog protivnika
            if (id !== null) {
              await db
                .query(
                  `
                    INSERT INTO borbe(id, protivnik_id, datum_borbe, rezultat) VALUES(
                      ${generatedId}, ${id}, '${x.datum_borbe}', '${x.rezultat}'
                    )
                  `
                )
                .catch((e) => {
                  throw new HTTPError(
                    "400",
                    "Error while adding fighter to database!"
                  );
                });
            } else {
              throw new HTTPError(
                "404",
                "Opponent does not exist in database!"
              );
            }
          } catch (e) {
            throw new HTTPError(e.errorCode, e.message);
          }
        })
      ).catch((e) => {
        throw new HTTPError(e.errorCode, e.message);
      });

    await db.query("COMMIT");
  } catch (e) {
    await db.query("ROLLBACK");
    console.log(e);
    throw new HTTPError(e.errorCode, e.message);
  } finally {
    db.release();
  }
  return {links: [
    {
      href: `/fighters/${generatedId}`,
      rel: "fighter",
      type: "GET",
    },
  ]}
}

async function deleteObject(id) {
  if (
    (await pool()
      .query(`SELECT id FROM borci WHERE id = ${id}`)
      .then((result) => {
        return result.rows.length;
      })
      .catch((e) => {
        throw new HTTPError("500", "Error connecting to database");
      })) === 0
  )
    throw new HTTPError("404", "Fighter does not exist!");

  const db = await pool().connect();
  try {
    await db.query("BEGIN");
    await pool().query(
      `
      DELETE FROM borbe 
      WHERE id = ${id} OR protivnik_id = ${id}
      `
    );

    await db.query(
      `
      DELETE FROM borci 
      WHERE id = ${id}
      `
    );

    await db.query("COMMIT");
  } catch (e) {
    await db.query("ROLLBACK");
    console.log(e);
    throw new HTTPError("500", "Error while deleting fighter from database!");
  } finally {
    db.release();
  }
  return;
}

module.exports = {
  getAll,
  getId,
  putObject,
  postObject,
  deleteObject,
  getFightersBrief,
};

function transformToJSON(inputDataArray) {
  var transformedArray = [];

  function transformFightData(fight) {
    let tmp = transformedArray.filter((x) => {
      return x !== undefined && x.id == fight.id;
    });
    if (tmp.length > 0) {
      if (fight.protivnik_ime !== null && fight.protivnik_prezime !== null)
        tmp[0].prethodne_borbe.push({
          protivnik: `${fight.protivnik_ime} ${fight.protivnik_prezime}`,
          rezultat: fight.rezultat,
          datum_borbe: `${formatDate(fight.datum_borbe)}`,
          links: [
            {
              href: `/fighters/${fight.protivnik_id}`,
              rel: "fighter",
              type: "GET",
            },
          ],
        });
      return 0;
    }

    const transformedFight = {
      id: fight.id,
      ime: fight.ime,
      prezime: fight.prezime,
      rekord: fight.rekord,
      datum_rođenja: `${formatDate(fight.datum_rođenja)}`,
      preciznost_značajnih_udaraca: fight.preciznost_značajnih_udaraca,
      broj_značajnih_udaraca_po_minuti: fight.broj_značajnih_udaraca_po_minuti,
      preciznost_rušenja: fight.preciznost_rušenja,
      broj_rušenja_po_minuti: fight.broj_rušenja_po_minuti,
      links: [
        {
          href: `/fights/${fight.id}`,
          rel: "fights",
          type: "GET",
        },
      ],
    };
    transformedFight.prethodne_borbe = [];
    if (fight.protivnik_ime !== null && fight.protivnik_prezime !== null)
      transformedFight.prethodne_borbe.push({
        protivnik: `${fight.protivnik_ime} ${fight.protivnik_prezime}`,
        rezultat: fight.rezultat,
        datum_borbe: `${formatDate(fight.datum_borbe)}`,
        links: [
          {
            href: `/fighters/${fight.protivnik_id}`,
            rel: "fighter",
            type: "GET",
          },
        ],
      });

    transformedArray.push(transformedFight);

    return 0;
  }

  inputDataArray.forEach((x) => transformFightData(x));

  return transformedArray;
}

async function checkIfExists(name_surname) {
  var tmp = await pool()
    .query(
      `SELECT 
        *
      FROM 
        borci 
      WHERE borci.ime = '${name_surname.split(" ")[0]}'  
      AND borci.prezime = '${name_surname.split(" ")[1]}'  
        `
    )
    .then((result) => {
      return result.rows;
    });
  return tmp.length > 0 ? tmp[0].id : null;
}

function formatDate(date_string) {
  var date = new Date(date_string);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}
