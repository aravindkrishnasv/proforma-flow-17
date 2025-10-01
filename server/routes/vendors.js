const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET all vendors
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM FINM.vendors ORDER BY name');
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
      'INSERT INTO FINM.vendors (name, address, phone, email, gstin, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address, phone, email, gstin, 'pending']
    );
    res.status(201).json(newVendor.rows[0]);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// PUT to update vendor status (for approval)
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedVendor = await pool.query(
            'UPDATE FINM.vendors SET status = $1, "updatedAt" = now() WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(updatedVendor.rows[0]);
    } catch (error) {
        console.error(`Error updating vendor status: ${error.message}`);
        res.status(500).json({ error: 'Failed to update vendor status' });
    }
});

// POST to add a communication log
router.post('/:id/communications', async (req, res) => {
    const { id } = req.params;
    const { log } = req.body;
    try {
        const updatedVendor = await pool.query(
            'UPDATE FINM.vendors SET communication_logs = communication_logs || $1, "updatedAt" = now() WHERE id = $2 RETURNING *',
            [JSON.stringify(log), id]
        );
        res.json(updatedVendor.rows[0]);
    } catch (error) {
        console.error(`Error adding communication log: ${error.message}`);
        res.status(500).json({ error: 'Failed to add communication log' });
    }
});

module.exports = router;