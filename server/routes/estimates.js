const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET all estimates
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM FINM.estimates ORDER BY "createdAt" DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET estimate count
router.get('/count', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM FINM.estimates');
    res.json({ count: parseInt(rows[0].count, 10) });
  } catch (error) {
    console.error('Error fetching estimate count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new estimate
router.post('/', async (req, res) => {
  const { estimate_number, customer_id, estimate_date, expiry_date, items, total_amount, status } = req.body;
  try {
    const newEstimate = await pool.query(
      'INSERT INTO FINM.estimates (estimate_number, customer_id, estimate_date, expiry_date, items, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [estimate_number, customer_id, estimate_date, expiry_date, JSON.stringify(items), total_amount, status]
    );
    res.status(201).json(newEstimate.rows[0]);
  } catch (error) {
    console.error('Error creating estimate:', error);
    res.status(500).json({ error: 'Failed to create estimate' });
  }
});

module.exports = router;