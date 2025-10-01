const { pool } = require('../db');

const createVendorsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS FINM.vendors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(255),
      gstin VARCHAR(15),
      status VARCHAR(20) DEFAULT 'pending',
      communication_logs JSONB,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

module.exports = {
  createVendorsTable,
};