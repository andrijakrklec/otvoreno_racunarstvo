var express = require("express");
const router = express.Router();

const { getAllFights, getFightsByFighterId } = require("../dao/fights.dao.js");
var Wrapper = require("../utilities/responseWrapper.js");

router.get("/", async (req, res) => {
  try {
    let result = await getAllFights();
    let wrapper = new Wrapper(result, "200", "Fetched all fight objects");
    res.json(wrapper.response());
  } catch (e) {
    let wrapper = new Wrapper(null, e.errorCode, e.message);
    return res.status(parseInt(e.errorCode)).json(wrapper.response());
  }
});

router.get("/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    let wrapper = new Wrapper(null, "422", "Invalid fighter id!");
    return res.status(400).json(wrapper.response());
  }

  try {
    let result = await getFightsByFighterId(id);
    let wrapper = new Wrapper(result, "200", "Fetched requested fight objects");
    res.json(wrapper.response());
  } catch (e) {
    let wrapper = new Wrapper(null, e.errorCode, e.message);
    return res.status(parseInt(e.errorCode)).json(wrapper.response());
  }
});

router.head("/", (req, res) => {
  let wrapper = new Wrapper(
    null,
    "501",
    "Method not implemented for requested resource"
  );
  return res.status(501).json(wrapper.response());
});

router.delete("/", (req, res) => {
  let wrapper = new Wrapper(
    null,
    "501",
    "Method not implemented for requested resource"
  );
  return res.status(501).json(wrapper.response());
});

router.patch("/", (req, res) => {
  let wrapper = new Wrapper(
    null,
    "501",
    "Method not implemented for requested resource"
  );
  return res.status(501).json(wrapper.response());
});

router.options("/", (req, res) => {
  let wrapper = new Wrapper(
    null,
    "501",
    "Method not implemented for requested resource"
  );
  return res.status(501).json(wrapper.response());
});

router.post("/", (req, res) => {
  let wrapper = new Wrapper(
    null,
    "501",
    "Method not implemented for requested resource"
  );
  return res.status(501).json(wrapper.response());
});

router.put("/", (req, res) => {
  let wrapper = new Wrapper(
    null,
    "501",
    "Method not implemented for requested resource"
  );
  return res.status(501).json(wrapper.response());
});

module.exports = router;
