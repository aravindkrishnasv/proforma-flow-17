import { Vendor, PurchaseOrder, Bill } from '@/types';

export const accountsPayableApi = {
  // Vendor API calls
  getVendors: async (): Promise<Vendor[]> => {
    const response = await fetch('/api/vendors');
    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }
    return response.json();
  },
  createVendor: async (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'communication_logs'>): Promise<Vendor> => {
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendor),
    });
    if (!response.ok) {
      throw new Error('Failed to create vendor');
    }
    return response.json();
  },
  updateVendorStatus: async (id: number, status: Vendor['status']): Promise<Vendor> => {
    const response = await fetch(`/api/vendors/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update vendor status');
    return response.json();
  },

  // Purchase Order API calls
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    const response = await fetch('/api/purchase-orders');
    if (!response.ok) {
      throw new Error('Failed to fetch purchase orders');
    }
    return response.json();
  },
  createPurchaseOrder: async (purchaseOrder: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> => {
    const response = await fetch('/api/purchase-orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purchaseOrder),
    });
    if (!response.ok) {
      throw new Error('Failed to create purchase order');
    }
    return response.json();
  },
  getPurchaseOrderCount: async (): Promise<{ count: number }> => {
    const response = await fetch('/api/purchase-orders/count');
    if (!response.ok) {
      throw new Error('Failed to fetch purchase order count');
    }
    return response.json();
  },
  getPurchaseOrder: async (id: string): Promise<PurchaseOrder> => {
    const response = await fetch(`/api/purchase-orders/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch purchase order');
    }
    const po = await response.json();
    if (typeof po.items === 'string') {
      po.items = JSON.parse(po.items);
    }
    return po;
  },

  // Bill API calls
  getBills: async (): Promise<Bill[]> => {
    const response = await fetch('/api/bills');
    if (!response.ok) {
      throw new Error('Failed to fetch bills');
    }
    return response.json();
  },
  createBill: async (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> => {
    const response = await fetch('/api/bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bill),
    });
    if (!response.ok) {
      throw new Error('Failed to create bill');
    }
    return response.json();
  },
  getBillCount: async (): Promise<{ count: number }> => {
    const response = await fetch('/api/bills/count');
    if (!response.ok) {
      throw new Error('Failed to fetch bill count');
    }
    return response.json();
  },
  batchPayBills: async (bill_ids: number[]): Promise<Bill[]> => {
    const response = await fetch('/api/bills/batch-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bill_ids }),
    });
    if (!response.ok) throw new Error('Failed to process batch payment');
    return response.json();
  },
};