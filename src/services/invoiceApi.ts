export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  taxPercent: number;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  
  // Seller Details
  sellerCompanyName: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerGSTIN: string;
  
  // Buyer Details
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerGSTIN: string;
  
  // Items and totals
  items: InvoiceItem[];
  subtotal: number;
  totalTax: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  
  createdAt?: string;
  updatedAt?: string;
}

// API service functions
export const invoiceApi = {
  // Get all invoices
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await fetch('/api/invoices');
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    return response.json();
  },

  // Get single invoice by ID
  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }
    return response.json();
  },

  // Create new invoice
  createInvoice: async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }
    return response.json();
  },

  // Update existing invoice
  updateInvoice: async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error('Failed to update invoice');
    }
    return response.json();
  },

  // Delete invoice
  deleteInvoice: async (id: string): Promise<void> => {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }
  },

  // Get invoice as PDF
  getInvoicePDF: async (id: string): Promise<Blob> => {
    const response = await fetch(`/api/invoices/${id}/pdf`);
    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    return response.blob();
  },
};