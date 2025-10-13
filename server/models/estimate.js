const { pool } = require('../db');

const createEstimatesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS FINM.estimates (
      id SERIAL PRIMARY KEY,
      estimate_number VARCHAR(50) NOT NULL UNIQUE,
      customer_id INTEGER REFERENCES FINM.customers(id),
      estimate_date DATE,
      expiry_date DATE,
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
  createEstimatesTable,
};