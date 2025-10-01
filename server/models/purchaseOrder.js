const { pool } = require('../db');

const createPurchaseOrdersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS FINM.purchase_orders (
      id SERIAL PRIMARY KEY,
      po_number VARCHAR(50) NOT NULL UNIQUE,
      vendor_id INTEGER REFERENCES FINM.vendors(id),
      items JSONB,
      total_amount NUMERIC(10, 2),
      advance_payment NUMERIC(10, 2) DEFAULT 0,
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