const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "pavan123", // Replace with your MySQL root password
//   database: "office_transactions",
// });
const db = mysql.createConnection({
  host: "i7s.h.filess.io",
  user: "officetransactions_thouglobe",
  port: "3306",
  password: "e73b4a1112b2386ccf6fc40f1452cb74f479c4cb", // Replace with your MySQL root password
  database: "officetransactions_thouglobe",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");

  // Create transactions table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATETIME NOT NULL,
      type ENUM('Credit', 'Debit') NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      description VARCHAR(255),
      running_balance DECIMAL(10, 2) NOT NULL
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating transactions table:", err);
      return;
    }
    console.log("Transactions table ready");
  });
});

app.get("/api/transactions", (req, res) => {
  db.query("SELECT * FROM transactions ORDER BY date desc", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post("/api/transactions", (req, res) => {
  const { type, amount, description } = req.body;

  db.query(
    "SELECT running_balance FROM transactions ORDER BY date DESC LIMIT 1",
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      let previousBalance = results.length > 0 ? results[0].running_balance : 0;
      let newBalance =
        type === "Credit" ? previousBalance + amount : previousBalance - amount;

      const transaction = {
        date: new Date(),
        type,
        amount,
        description,
        running_balance: newBalance,
      };

      db.query(
        "INSERT INTO transactions SET ?",
        transaction,
        (err, results) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(201).send("Transaction added");
        }
      );
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
