const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "decidetucancha"
});

conexion.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err.message);
    throw err;
  }
  console.log("Connected to the MySQL database.");
});

module.exports = conexion;

