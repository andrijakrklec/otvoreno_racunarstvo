var path = require("path");

var pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "UFC_borci",
  password: "bazepodataka",
  port: 5432,
});

const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

app.get("/datatables", (req, res) => {
  return res.sendFile(__dirname + "/datatables.html");
});

app.get("/data/UFC_borci.csv", (req, res) => {
  return res.sendFile("/UFC_borci.csv");
});

app.get("/data/UFC_borci.json", (req, res) => {
  return res.sendFile("/UFC_borci.json");
});

app.post("/", async (req, res) => {
  var querryString = "WHERE ";
  if (
    req.body.selectPolje == "protivnik" ||
    req.body.selectPolje == "rezultat" ||
    req.body.selectPolje == "datum_borbe"
  ) {
    querryString += "borbe.";
  } else {
    querryString += "borci.";
  }
  if (
    req.body.selectPolje == "datum_rođenja" ||
    req.body.selectPolje == "datum_borbe" ||
    req.body.selectPolje == "broj_značajnih_udaraca_po_minuti" ||
    req.body.selectPolje == "broj_rušenja_po_minuti"
  )
    querryString += `${req.body.selectPolje} = '${req.body.textPolje}'`;
  else if (req.body.selectPolje == "protivnik")
    querryString += `b.ime || ' ' || b.prezime LIKE '%${req.body.textPolje}%'`;
  else querryString += `${req.body.selectPolje} LIKE '%${req.body.textPolje}%'`;

  if (req.body.selectPolje == "sva") {
    let tmpStr = () => {
      if (isNumeric(req.body.textPolje)) {
        return `OR borci.broj_značajnih_udaraca_po_minuti = ${req.body.textPolje}\
              OR borci.broj_rušenja_po_minuti = ${req.body.textPolje}\
                                              `;
      } else {
        if (isDateFormatValid(req.body.textPolje)) {
          return `OR borci.datum_rođenja = '${req.body.textPolje}'\
                  OR borbe.datum_borbe = '${req.body.textPolje}'\
               `;
        }
      }
      return "";
    };
    querryString = `WHERE borci.ime LIKE '%${req.body.textPolje}%'\
                    OR borci.prezime LIKE '%${req.body.textPolje}%'\
                    OR borci.rekord LIKE '%${req.body.textPolje}%'\
                    OR borci.preciznost_značajnih_udaraca LIKE '%${
                      req.body.textPolje
                    }%'\
                    ${tmpStr()}\
                    OR borci.preciznost_rušenja LIKE '%${req.body.textPolje}%'\
                    OR b.ime || ' ' || b.prezime LIKE '%${req.body.textPolje}%'\
                    OR borbe.rezultat LIKE '%${req.body.textPolje}%'\
                    `;
  }
  var tmp = await pool
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
      b.ime protivnik_ime, 
      b.prezime protivnik_prezime, 
      borbe.datum_borbe,
      rezultat 
    FROM 
      borci 
      JOIN borbe ON (
        borci.id = borbe.id 
      ) 
      JOIN borci b ON (b.id = borbe.protivnik_id) \
         ${querryString}`
    )
    .then((result) => {
      return result.rows;
    });
  // console.log(tmp);
  return res.send(tmp);
});

app.listen(3000);

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function isDateFormatValid(dateString) {
  const pattern = /^\d{2}.\d{2}.\d{4}.$/;
  return pattern.test(dateString);
}
