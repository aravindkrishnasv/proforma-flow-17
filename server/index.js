// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// A test endpoint
app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});

// GET all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM invoices ORDER BY "createdAt" DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new invoice
app.post('/api/invoices', async (req, res) => {
  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    sellerCompanyName,
    sellerAddress,
    sellerPhone,
    sellerEmail,
    sellerGSTIN,
    buyerName,
    buyerAddress,
    buyerPhone,
    buyerEmail,
    buyerGSTIN,
    items,
    subtotal,
    totalTax,
    totalAmount,
    status,
  } = req.body;

  try {
    const newInvoice = await pool.query(
      `INSERT INTO invoices (
        "invoiceNumber", "invoiceDate", "dueDate", "sellerCompanyName", "sellerAddress",
        "sellerPhone", "sellerEmail", "sellerGSTIN", "buyerName", "buyerAddress",
        "buyerPhone", "buyerEmail", "buyerGSTIN", items, subtotal,
        "totalTax", "totalAmount", status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        invoiceNumber,
        invoiceDate,
        dueDate,
        sellerCompanyName,
        sellerAddress,
        sellerPhone,
        sellerEmail,
        sellerGSTIN,
        buyerName,
        buyerAddress,
        buyerPhone,
        buyerEmail,
        buyerGSTIN,
        JSON.stringify(items), // Make sure to stringify the items array for JSONB
        subtotal,
        totalTax,
        totalAmount,
        status,
      ]
    );

    res.status(201).json(newInvoice.rows[0]);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});