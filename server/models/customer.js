const { pool } = require('../db');

const createCustomersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS FINM.customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(255),
      gstin VARCHAR(15),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

module.exports = {
  createCustomersTable,
};