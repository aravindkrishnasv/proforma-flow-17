export interface Vendor {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  vendor_id: number;
  items: any[]; // You can define a more specific type for items
  total_amount: number;
  status: 'draft' | 'approved' | 'billed';
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: number;
  bill_number: string;
  vendor_id: number;
  purchase_order_id: number;
  bill_date: string;
  due_date: string;
  items: any[]; // You can define a more specific type for items
  total_amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}