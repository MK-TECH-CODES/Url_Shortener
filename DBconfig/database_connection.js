const mysql = require("mysql");
require("dotenv").config();

// // Create the connection function
// const connection = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD, // Replace with your actual password
//   database: process.env.DATABASE, // Database name
// });

// // Connect to the MySQL database
// // connection.connect(function (err) {
// //   if (err) {
// //     console.error("Error connecting: " + err.stack);
// //     return;
// //   }
// //   console.log("Connected as id " + connection.threadId);
// // });

// // connection.end();

const pool = mysql.createPool({
  connectionLimit: 10, // Limit the number of connections
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD, // Replace with your actual password
  database: process.env.DATABASE, // Database name
});

// pool.getConnection((err, connection) => {
//   if (err) throw err; // Not connected!

//   // Use the connection
//   connection.query("SELECT * FROM user_url", (error, results) => {
//     // Release the connection back to the pool
//     connection.release();

//     if (error) throw error;

//     // Handle results
//     console.log(results);
//   });
// });

module.exports = pool;
