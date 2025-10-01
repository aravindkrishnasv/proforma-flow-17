const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET all bills
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM FINM.bills ORDER BY bill_date DESC');
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
    const { rows } = await pool.query('SELECT COUNT(*) FROM FINM.bills');
    res.json({ count: parseInt(rows[0].count, 10) });
  } catch (error) {
    console.error('Error fetching bill count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new bill
router.post('/', async (req, res) => {
  const { bill_number, vendor_id, purchase_order_id, bill_date, due_date, items, total_amount, status, is_recurring, recurrence_frequency } = req.body;
  try {
    const newBill = await pool.query(
      'INSERT INTO FINM.bills (bill_number, vendor_id, purchase_order_id, bill_date, due_date, items, total_amount, status, is_recurring, recurrence_frequency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [bill_number, vendor_id, purchase_order_id, bill_date, due_date, JSON.stringify(items), total_amount, status, is_recurring, recurrence_frequency]
    );
    res.status(201).json(newBill.rows[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

// POST for batch payments
router.post('/batch-payment', async (req, res) => {
    const { bill_ids } = req.body;
    try {
        const updatedBills = await pool.query(
            'UPDATE FINM.bills SET status = $1, "updatedAt" = now() WHERE id = ANY($2) RETURNING *',
            ['paid', bill_ids]
        );
        res.json(updatedBills.rows);
    } catch (error) {
        console.error(`Error processing batch payment: ${error.message}`);
        res.status(500).json({ error: 'Failed to process batch payment' });
    }
});


module.exports = router;