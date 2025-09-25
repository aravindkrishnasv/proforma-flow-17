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
};