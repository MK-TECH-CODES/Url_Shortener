const valid_url = require("valid-url");

function check_valid_url(valid_url_data) {
  // if (
  //   valid_url.isUri(url) &&
  //   valid_url.isWebUri(url) &&
  //   (valid_url.isHttpUri(url) || valid_url.isHttpsUri(url))
  // ) {
  //   return true;
  // } else {
  //   return false;
  // }

  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(valid_url_data);
}

module.exports = { check_valid_url };
