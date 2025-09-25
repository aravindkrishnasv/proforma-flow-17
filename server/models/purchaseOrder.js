const { pool } = require('../db');

const createPurchaseOrdersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id SERIAL PRIMARY KEY,
      po_number VARCHAR(50) NOT NULL UNIQUE,
      vendor_id INTEGER REFERENCES vendors(id),
      items JSONB,
      total_amount NUMERIC(10, 2),
      status VARCHAR(20) DEFAULT 'draft',
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

module.exports = {
  createPurchaseOrdersTable,
};