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
  createVendor: async (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> => {
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
    // The items from the DB are a string, so we need to parse them
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
};