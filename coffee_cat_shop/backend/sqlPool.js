let mysql = require("mysql2");

let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on("connection", function (connection) {
  connection.query('SET time_zone = "+7:00";', function (err) {
    if (err) {
      console.log("lỗi");
      console.error(err);
      return;
    } else {
      console.log("Connected to database");
    }
  });
});

const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, conn) => {
      if (error) {
        reject(error);
      } else {
        conn.query(sql, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
        conn.release();
      }
    });
  });
};

module.exports = query;
