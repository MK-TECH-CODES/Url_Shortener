const path = require("path");

const Link_Generate = (req, res) => {
  res.sendfile(path.join(__dirname, "../public/Home/Home.html"));
};

module.exports = {
  Link_Generate,
};
