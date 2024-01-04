const express = require("express");
const router = express.Router();

router.get("/UFC_borci.json", async (req, res) => {
  if (req.isAuthenticated()) {
    let dirname = __dirname.split("\\");
    dirname.pop();
    dirname = dirname.join("\\");

    return res.sendFile(dirname + "/public/data/UFC_borci.json");
  } else {
    return res.sendStatus(401);
  }
});

router.get("/UFC_borci.csv", async (req, res) => {
  if (req.isAuthenticated()) {
    let dirname = __dirname.split("\\");
    dirname.pop();
    dirname = dirname.join("\\");

    return res.sendFile(dirname + "/public/data/UFC_borci.csv");
  } else {
    return res.sendStatus(401);
  }
});

module.exports = router;
