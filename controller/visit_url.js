const db_connection = require("../DBconfig/database_connection");

const Visit_url = (req, res) => {
  const Short_ID = req.params.id;

  // Check if Short_ID has the expected length
  if (Short_ID.length === 6) {
    // DB Access
    db_connection.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting connection:", err);
        return res.status(500).send("Database connection error.");
      }

      // Use parameterized query to prevent SQL injection
      const sql = `SELECT url FROM user_url WHERE shortener = ?`;

      connection.query(sql, [Short_ID], (error, result) => {
        connection.release(); // Release connection back to pool
        if (error) {
          console.error("Error executing query:", error);
          return res.status(500).send("Database query error.");
        }

        // Check if any result was returned
        if (result.length > 0) {
          const originalUrl = result[0].url; // Get the original URL
          // console.log("Original URL:", originalUrl);

          // Redirect to the original URL
          res.redirect(originalUrl);
        } else {
          console.error("No URL found for the given shortener.");
          res.status(404).send("URL not found.");
        }
      });
    });
  } else {
    // Invalid shortener ID length
    res.status(400).send("Invalid shortener ID.");
  }
};

module.exports = {
  Visit_url,
};
