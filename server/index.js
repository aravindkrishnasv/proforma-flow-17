// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db'); // Assuming you've created a db.js as suggested
const { createVendorsTable } = require('./models/vendor');
const { createPurchaseOrdersTable } = require('./models/purchaseOrder');
const { createBillsTable } = require('./models/bill');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Import routes
const vendorsRouter = require('./routes/vendors');
const purchaseOrdersRouter = require('./routes/purchaseOrders');
const billsRouter = require('./routes/bills');

// Use new Accounts Payable routes
app.use('/api/vendors', vendorsRouter);
app.use('/api/purchase-orders', purchaseOrdersRouter);
app.use('/api/bills', billsRouter);

// A test endpoint
app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});

// --- EXISTING INVOICE ROUTES ---

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

app.get('/api/invoice-count', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM invoices WHERE EXTRACT(YEAR FROM "invoiceDate") = $1',
      [currentYear]
    );
    res.json({ count: parseInt(rows[0].count, 10) });
  } catch (error) {
    console.error('Error fetching invoice count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a single invoice by ID
app.get('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) an invoice by ID
app.put('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
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
    const updatedInvoice = await pool.query(
      `UPDATE invoices SET 
        "invoiceNumber" = $1, "invoiceDate" = $2, "dueDate" = $3, "sellerCompanyName" = $4, "sellerAddress" = $5,
        "sellerPhone" = $6, "sellerEmail" = $7, "sellerGSTIN" = $8, "buyerName" = $9, "buyerAddress" = $10,
        "buyerPhone" = $11, "buyerEmail" = $12, "buyerGSTIN" = $13, items = $14, subtotal = $15,
        "totalTax" = $16, "totalAmount" = $17, status = $18, "updatedAt" = now()
      WHERE id = $19 RETURNING *`,
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
        JSON.stringify(items),
        subtotal,
        totalTax,
        totalAmount,
        status,
        id
      ]
    );

    if (updatedInvoice.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(updatedInvoice.rows[0]);
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});


// DELETE an invoice by ID
app.delete('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM invoices WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete invoice' });
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
        JSON.stringify(items),
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

// --- DATABASE INITIALIZATION ---
const initializeDatabase = async () => {
  try {
    // You should also create the 'invoices' table here if it's not already handled
    // For now, we'll just initialize the new tables
    await createVendorsTable();
    await createPurchaseOrdersTable();
    await createBillsTable();
    console.log("Database tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing database tables:", error);
  }
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  initializeDatabase();
});