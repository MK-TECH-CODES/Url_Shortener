const db_connection = require("../DBconfig/database_connection");
const qr = require("qr-image");
const { check_valid_url } = require("./url_validate");

function generateRandomLetters(length) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

// const randomLetters = generateRandomLetters(6); // Generate 6 random alphabet letters
// console.log(randomLetters);

const url_shorten_function = (req, res) => {
  // User URL from the request body
  const url = req.body.user_url;

  // Validate the existence of the URL
  if (!url) {
    return res.status(400).send({ message: "URL is required" });
  }
  try {
    const url_short_id = generateRandomLetters(6);
    // Use valid-url to check if the URL is valid
    if (check_valid_url(url)) {
      const generated = "url.zaptian.com/" + url_short_id;
      const qr_image = qr.image(url, { type: "png" });
      // const qr_image_name = "qr_code.png";

      let qr_image_data = [];

      qr_image.on("data", (chunk) => {
        qr_image_data.push(chunk); // Collect chunks of data
      });

      qr_image.on("end", () => {
        const qr_image_buffer = Buffer.concat(qr_image_data); // Combine chunks into a single buffer

        db_connection.getConnection((err, connection) => {
          if (err) {
            console.error("Error getting connection:", err);
            return res.status(500).send("Database connection error.");
          }

          // Use parameterized query to prevent SQL injection
          const sql = `INSERT INTO user_url (url, shortener) VALUES (?, ?)`;
          const values = [url, url_short_id]; // Use the buffer for the image

          const qrCodeBase64 = qr_image_buffer.toString("base64");
          // console.log(qrCodeBase64);

          connection.query(sql, values, (error, result) => {
            connection.release(); // Release connection back to pool
            if (error) {
              console.error("Error executing query:", error);
              return res.status(500).send("Database query error.");
            }
            // Send the shortened URL back in the response
            if (result) {
              res
                .status(200)
                .send({ shortened_url: generated, Qr_code: qrCodeBase64 });
            }
          });
        });
      });

      // Handle errors during QR generation
      qr_image.on("error", (error) => {
        console.error("Error generating QR code:", error);
        return res.status(500).send("Error generating QR code.");
      });

      // connection.end();

      // res.status(200).send({ shortened_url: generated });
    } else {
      res.status(400).send({ message: "Invalid URL format" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  url_shorten_function,
};
