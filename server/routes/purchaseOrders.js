const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET all purchase orders
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM purchase_orders ORDER BY "createdAt" DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET purchase order count
router.get('/count', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM purchase_orders');
    res.json({ count: parseInt(rows[0].count, 10) });
  } catch (error) {
    console.error('Error fetching purchase order count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new purchase order
router.post('/', async (req, res) => {
  const { po_number, vendor_id, items, total_amount, status } = req.body;
  try {
    const newPurchaseOrder = await pool.query(
      'INSERT INTO purchase_orders (po_number, vendor_id, items, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [po_number, vendor_id, JSON.stringify(items), total_amount, status]
    );
    res.status(201).json(newPurchaseOrder.rows[0]);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

module.exports = router;