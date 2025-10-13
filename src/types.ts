export interface Vendor {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  status: 'pending' | 'approved' | 'rejected';
  communication_logs: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface PurchaseOrderItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  vendor_id: number;
  items: PurchaseOrderItem[];
  total_amount: number;
  advance_payment: number;
  status: 'draft' | 'approved' | 'sent' | 'partially_received' | 'closed' | 'billed';
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

export interface Bill {
  id: number;
  bill_number: string;
  vendor_id: number;
  purchase_order_id: number;
  bill_date: string;
  due_date: string;
  items: BillItem[];
  total_amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  is_recurring: boolean;
  recurrence_frequency: string;
  createdAt: string;
  updatedAt: string;
}

export interface EstimateItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

export interface Estimate {
  id: number;
  estimate_number: string;
  customer_id: number;
  estimate_date: string;
  expiry_date: string;
  items: EstimateItem[];
  total_amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
}