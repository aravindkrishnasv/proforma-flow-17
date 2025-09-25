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
  status: 'draft' | 'approved' | 'billed';
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
  createdAt: string;
  updatedAt: string;
}