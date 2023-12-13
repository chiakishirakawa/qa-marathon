const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3509;


const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_chiaki_shirakawa", // PostgreSQLのユーザー名に置き換えてください
  host: "localhost",
  database: "db_chiaki_shirakawa", // PostgreSQLのデータベース名に置き換えてください
  password: "pass", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers ORDER BY customer_id");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.get(`/customer/:id`, async (req, res) => {
  const id = req.params.id;
  try {
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1",[id]);
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
    try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.get("/delete-customer/:id",async(req,res) =>{
  const id = req.params.id;
  try{
    console.log('hj');
    const newCustomer = await pool.query( "DELETE FROM customers WHERE customer_id = $1",[id]);
    res.json({ success: true});
  }catch(err){
    res.json({ success: false });
  }
});

app.post("/update-customer/:id",async(req,res) =>{
  const id = req.params.id;
  try{
    const { companyName, industry, contact, location } = req.body;
    const updateCustomer = await pool.query(
      "UPDATE customers SET company_name =$1, industry=$2, contact =$3, location =$4 WHERE customer_id = $5",
      [companyName, industry, contact, location,id]);
      console.log(companyName);
    res.json({ success: true});
  }catch(err){
    res.json({ success: false });
  }
});

app.use(express.static("public"));
