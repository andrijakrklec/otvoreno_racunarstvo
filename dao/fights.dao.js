var pg = require("pg");
var HTTPError = require("../utilities/errorWrapper.js");
const {getId} = require("../dao/fighters.dao.js");


//test to see if the pool is created only once
var poolVar = null;

const pool = function () {
  if (poolVar === null)
    poolVar = new pg.Pool({
      user: "postgres",
      host: "localhost",
      database: "UFC_borci",
      password: "kr182ge",
      port: 5432,
    });
  return poolVar;
};

async function getAllFights() {
  var tmp = await pool()
    .query(
      `
        SELECT borbe.id id_borca,
               b1.ime || ' ' || b1.prezime ime_borca,
               borbe.protivnik_id id_protivnika,
               b2.ime || ' ' || b2.prezime ime_protivnika, 
               datum_borbe, 
               rezultat
            FROM borbe JOIN borci b1 on (borbe.id=b1.id)
            JOIN borci b2 on (borbe.protivnik_id=b2.id)
        `
    )
    .then((result) => {
      return result.rows;
    })
    .catch((e) => {
      throw new HTTPError("500", "Error connecting to database");
    });

  return transformJSON(tmp);
}

async function getFightsByFighterId(id) {
  try {
    let tmp = await getId(id);
    if (tmp.length == 0) throw new HTTPError("404", "Fighter does not exist!")
  } catch(e) {
    throw new HTTPError(e.errorCode, e.message)
  }
  var tmp = await pool()
    .query(
      `
        SELECT borbe.id id_borca,
               b1.ime || ' ' || b1.prezime ime_borca,
               borbe.protivnik_id id_protivnika,
               b2.ime || ' ' || b2.prezime ime_protivnika, 
               datum_borbe, 
               rezultat
            FROM borbe JOIN borci b1 on (borbe.id=b1.id)
            JOIN borci b2 on (borbe.protivnik_id=b2.id)
            WHERE borbe.id=${id} OR borbe.protivnik_id=${id}
        `
    )
    .then((result) => {
        return result.rows;
    })
    .catch((e) => {
      throw new HTTPError("500", "Error connecting to database");
    });

  return transformJSON(tmp);
}

module.exports = { getAllFights, getFightsByFighterId };

function formatDate(date_string) {
  var date = new Date(date_string);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function transformJSON(array) {
  function tranformFight(fight) {
    return {
      borac: {
        id_borca: fight.id_borca,
        ime_borca: fight.ime_borca,
        links: [{
            "href": `/fighters/${fight.id_borca}`,
            "rel": "fighter",
            "type": "GET"
          }]
      },
      protivnik: {
        id_protivnika: fight.id_protivnika,
        ime_protivnika: fight.ime_protivnika,
        links: [{
            "href": `/fighters/${fight.id_protivnika}`,
            "rel": "fighter",
            "type": "GET"
          }]
      },
      datum_borbe: formatDate(fight.datum_borbe),
      rezultat: fight.rezultat,
    };
  }

  converted_array = array.map(tranformFight);
  return converted_array;
}
