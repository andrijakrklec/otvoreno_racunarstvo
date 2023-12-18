const {
  getAll,
  getId,
  putObject,
  postObject,
  deleteObject,
  getFightersBrief,
} = require("../dao/fighters.dao.js");
var Wrapper = require("../utilities/responseWrapper.js");

var express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  let result;
  try {
    result = await getAll();
  } catch(e) {
    let wrapper = new Wrapper(null, e.errorCode, e.message);
    return res.status(parseInt(e.errorCode)).json(wrapper.response());
  }

  let wrapper = new Wrapper(result, "200", "Fetched all fighter objects");
  res.json(wrapper.response());
});

router.get("/brief", async (req, res) => {
  let result;
  try {
    result = await getFightersBrief();
  } catch(e) {
    let wrapper = new Wrapper(null, e.errorCode, e.message);
    return res.status(parseInt(e.errorCode)).json(wrapper.response());
  }

  let wrapper = new Wrapper(result, "200", "Fetched all fighter objects");
  res.json(wrapper.response());
});

router.get("/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    let wrapper = new Wrapper(null, "422", "Invalid fighter id!");
    return res.status(400).json(wrapper.response());
  }

  let result;
  try {
    result = await getId(id);
  } catch(e) {
    let wrapper = new Wrapper(null, e.errorCode, e.message);
    return res.status(parseInt(e.errorCode)).json(wrapper.response());
  }

  if (result.length == 0) {
    let wrapper = new Wrapper(null, "404", "Fighter does not exist!");
    res.status(404).json(wrapper.response());
  } else {
    let wrapper = new Wrapper(result, "200", "Fetched fighter object");
    res.json(wrapper.response());
  }
});

router.put("/", async (req, res) => {
  let result;
  try {
    result = await putObject(req.body);
    let wrapper = new Wrapper(
      result,
      "200",
      "Fighter data modified successfully!"
    );
    res.json(wrapper.response());
  } catch (e) {
    let wrapper = new Wrapper(null, e.errorCode, e.message);
    return res.status(parseInt(e.errorCode)).json(wrapper.response());
  }
});

router.post("/", async (req, res) => {
  let result;
  try {
    result = await postObject(req.body);
    let wrapper = new Wrapper(result, "201", "Fighter added successfully!");
    res.header("Location", result.links[0].href);
    res.status(201).json(wrapper.response());
  } catch (e) {
    let wrapper = new Wrapper(null, e.errorCode, e.message);
    return res.status(parseInt(e.errorCode)).json(wrapper.response());
  }
});

router.delete("/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    let wrapper = new Wrapper(null, "422", "Invalid fighter id!");
    return res.status(400).json(wrapper.response());
  }

  let result;
  try {
    result = await deleteObject(id);
    let wrapper = new Wrapper(result, "200", "Fighter deleted successfully!");
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

module.exports = router;
