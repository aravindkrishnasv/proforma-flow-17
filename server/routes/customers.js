const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET all customers
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM FINM.customers ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new customer
router.post('/', async (req, res) => {
  const { name, address, phone, email, gstin } = req.body;
  try {
    const newCustomer = await pool.query(
      'INSERT INTO FINM.customers (name, address, phone, email, gstin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, address, phone, email, gstin]
    );
    res.status(201).json(newCustomer.rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

module.exports = router;