const { pool } = require('../db');

const createBillsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS FINM.bills (
      id SERIAL PRIMARY KEY,
      bill_number VARCHAR(50) NOT NULL UNIQUE,
      vendor_id INTEGER REFERENCES FINM.vendors(id),
      purchase_order_id INTEGER REFERENCES FINM.purchase_orders(id),
      bill_date DATE,
      due_date DATE,
      items JSONB,
      total_amount NUMERIC(10, 2),
      status VARCHAR(20) DEFAULT 'unpaid',
      is_recurring BOOLEAN DEFAULT false,
      recurrence_frequency VARCHAR(20),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

module.exports = {
  createBillsTable,
};