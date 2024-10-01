const express = require("express");

const { url_shorten_function } = require("../controller/url_short");
const router = express.Router();

router.post("/data", url_shorten_function);

// Export the route;
module.exports = router;
