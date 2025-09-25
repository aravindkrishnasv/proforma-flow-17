const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET all bills
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bills ORDER BY bill_date DESC');
    res.json(rows);
  } catch (error)
 {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET bill count
router.get('/count', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM bills');
    res.json({ count: parseInt(rows[0].count, 10) });
  } catch (error) {
    console.error('Error fetching bill count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new bill
router.post('/', async (req, res) => {
  const { bill_number, vendor_id, purchase_order_id, bill_date, due_date, items, total_amount, status } = req.body;
  try {
    const newBill = await pool.query(
      'INSERT INTO bills (bill_number, vendor_id, purchase_order_id, bill_date, due_date, items, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [bill_number, vendor_id, purchase_order_id, bill_date, due_date, JSON.stringify(items), total_amount, status]
    );
    res.status(201).json(newBill.rows[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

module.exports = router;