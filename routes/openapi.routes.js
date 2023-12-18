var express = require("express");
const router = express.Router();

var Wrapper = require("../utilities/responseWrapper.js");

router.get("/", (req,res) => {
    try {
        var openapi = require("../openapi.json")
        let wrapper = new Wrapper(openapi, "200", "Fetched OpenAPI specification");
        res.json(wrapper.response());
    } catch(e) {
        let wrapper = new Wrapper(null, "404", "File does not exist!");
        return res.status(404).json(wrapper.response());
    }
})


module.exports = router;

