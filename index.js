// Add required packages
const express = require("express");
const app = express();
require('dotenv').config();
const path = require("path");
const { Pool } = require("pg");

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: "cxokgmthkdveuw",
    host: "ec2-54-85-13-135.compute-1.amazonaws.com",
    database: "d1hqv4hhdclo65",
    password: "56ec6e0fb3310a902831f85ce0b1b34bd08f8a10f6dedf328db3556d3ba24cff",
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});
console.log("Successful connection to the database");

// Creating the Books table (Book_ID, Title, Author, Comments)
const sql_create = `CREATE TABLE IF NOT EXISTS PRODUCT  (
    prod_id     SERIAL PRIMARY KEY,
    prod_name  	VARCHAR(20) NOT NULL,
    prod_desc 	VARCHAR(50),
    prod_price  NUMERIC
);`;
pool.query(sql_create, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the 'PRODUCT' table");
});

// Database seeding
const sql_insert = `INSERT INTO PRODUCT (prod_id, prod_name, prod_desc, prod_price) VALUES
('101', 'Pen', 'Black Ink', '0.99'),
('102', 'Pencil', 'Yellow No. 2', '0.35'),
('103', 'Paper', 'College Rule', '1.10'),
('104', 'Eraser', 'Pink', '0.75'),
('105', 'Calculator', 'Scientific', '99.99'),
('106', 'Camera', 'Desktop 720p', '39.99'),
('107', 'Ruler', '12"', '4.75'),
('108', 'Stamps', 'Dozen', '6.60'),
('109', 'Notepad', '8.5 by 11', '2.95'),
('110', 'Charger', 'USB', '22.50')
ON CONFLICT DO NOTHING;`;
pool.query(sql_insert, [], (err, result) => {
    if (err) {
        return console.error(err.message);
    }
    const sql_sequence = "SELECT SETVAL('PRODUCT_prod_id_Seq', MAX(prod_id)) FROM PRODUCT;";
    pool.query(sql_sequence, [], (err, result) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Successful creation of 10 products");
    });
});

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send ("Hello world...");
    const sql = "SELECT * FROM PRODUCT ORDER BY prod_id";
    pool.query(sql, [], (err, result) => {
        var message = "";
        var model = {};
        if(err) {
            message = `Error - ${err.message}`;
        } else {
            message = "success";
            model = result.rows;
        };
        console.log(message);
        res.render("index", {
            message: message,
            model : model
        });
    });
});