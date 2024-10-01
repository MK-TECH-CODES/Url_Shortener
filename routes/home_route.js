const express = require("express");
const { Link_Generate } = require("../controller/home_controller");
const { Visit_url } = require("../controller/visit_url");
// Routing the Paths
const router = express.Router();



router.get("/", Link_Generate);

router.get("/:id", Visit_url);

module.exports = router;
