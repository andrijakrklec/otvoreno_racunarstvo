const express = require("express");

const pg = require("pg");
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

const app = express();

const dataRouter = require("./routes/data.routes");
const profileRouter = require("./routes/profile.routes");

const session = require("express-session");

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const strategy = new Auth0Strategy(
  {
    domain: process.env.ISSUER_BASE_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET,
    callbackURL: "http://localhost:3001/callback", // Set your callback URL
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

passport.use(strategy);

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res, next) => {
  passport.authenticate("auth0", {
    scope: "openid email profile",prompt: "none",
  })(req, res, next);
});

app.get("/login-form", (req, res, next) => {
  passport.authenticate("auth0", {
    scope: "openid email profile",prompt: "login",
  })(req, res, next);
});

app.get("/refresh", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  let dirname = __dirname.split("\\").join("/") + "/public/data/";
  console.log(dirname)
  var tmp = await pool()
    .query(
      `COPY (
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
      ) TO '${dirname}UFC_borci.json';
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
          rezultat 
        from 
          borci 
          join borbe on (
            borci.id = borbe.id 
          ) 
          join borci b on (b.id = borbe.protivnik_id)
      ) TO '${dirname}UFC_borci.csv' WITH DELIMITER ',' CSV HEADER;
      `
    )
    .then((result) => {
      //console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  return res.redirect("/home");
});

app.get(
  "/",
  (req, res) => {
    res.redirect("/home");
  }
);

app.get(
  "/callback",
  passport.authenticate("auth0", { failureRedirect: "/login-form" }),
  (req, res) => {
    res.redirect("/home");
  }
);

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/home");
  });
});

app.get("/home", (req, res) => {
  return res.render(__dirname + "/public/html/index.ejs", { user: req.user });
});

app.get("/datatables", (req, res) => {
  return res.sendFile(__dirname + "/public/html/datatables.html");
});

app.use("/data", dataRouter);
app.use("/profile", profileRouter);

app.listen(3001);
