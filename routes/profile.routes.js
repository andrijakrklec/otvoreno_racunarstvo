const express = require("express");
const ejs = require("ejs");
const router = express.Router();

// req.isAuthenticated is provided from the auth router
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    let dirname = __dirname.split("\\");
    dirname.pop();
    dirname = dirname.join("\\");
    return res.render(dirname + "/public/html/profile.ejs", {
        user: req.user._json,
        });
  } else {
    return res.sendStatus(401);
  }
});

module.exports = router;
