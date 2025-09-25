const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET all vendors
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vendors ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new vendor
router.post('/', async (req, res) => {
  const { name, address, phone, email, gstin } = req.body;
  try {
    const newVendor = await pool.query(
      'INSERT INTO vendors (name, address, phone, email, gstin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, address, phone, email, gstin]
    );
    res.status(201).json(newVendor.rows[0]);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

module.exports = router;