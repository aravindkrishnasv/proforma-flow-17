CREATE SCHEMA IF NOT EXISTS FINM;

CREATE TABLE IF NOT EXISTS FINM.invoices (
  id SERIAL PRIMARY KEY,
  "invoiceNumber" VARCHAR(50) NOT NULL UNIQUE,
  "invoiceDate" DATE,
  "dueDate" DATE,
  "sellerCompanyName" VARCHAR(255),
  "sellerAddress" TEXT,
  "sellerPhone" VARCHAR(20),
  "sellerEmail" VARCHAR(255),
  "sellerGSTIN" VARCHAR(15),
  "buyerName" VARCHAR(255),
  "buyerAddress" TEXT,
  "buyerPhone" VARCHAR(20),
  "buyerEmail" VARCHAR(255),
  "buyerGSTIN" VARCHAR(15),
  items JSONB,
  subtotal NUMERIC(10, 2),
  "totalTax" NUMERIC(10, 2),
  "totalAmount" NUMERIC(10, 2),
  status VARCHAR(20),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
