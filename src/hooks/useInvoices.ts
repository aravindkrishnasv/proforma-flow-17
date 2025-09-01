import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi, Invoice } from '@/services/invoiceApi';
import { toast } from '@/hooks/use-toast';

// Query keys
export const INVOICE_QUERY_KEYS = {
  all: ['invoices'] as const,
  lists: () => [...INVOICE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...INVOICE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...INVOICE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...INVOICE_QUERY_KEYS.details(), id] as const,
};

// Get all invoices
export const useInvoices = () => {
  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.lists(),
    queryFn: async () => {
      const invoices = await invoiceApi.getInvoices();
      
      // If the API returns nothing or not an array, return an empty array.
      if (!Array.isArray(invoices)) {
        return [];
      }
      
      // This is the critical part: convert string numbers into actual numbers.
      return invoices.map(invoice => ({
        ...invoice,
        subtotal: parseFloat(invoice.subtotal as any),
        totalTax: parseFloat(invoice.totalTax as any),
        totalAmount: parseFloat(invoice.totalAmount as any),
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single invoice
export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: INVOICE_QUERY_KEYS.detail(id),
    queryFn: () => invoiceApi.getInvoice(id),
    enabled: !!id,
  });
};

// Create invoice mutation
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceApi.createInvoice,
    onSuccess: (newInvoice) => {
      // Invalidate and refetch invoices list
      queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEYS.lists() });
      
      toast({
        title: "Success",
        description: `Invoice ${newInvoice.invoiceNumber} created successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });
};

// Update invoice mutation
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Invoice> }) =>
      invoiceApi.updateInvoice(id, data),
    onSuccess: (updatedInvoice) => {
      // Update the specific invoice in cache
      queryClient.setQueryData(
        INVOICE_QUERY_KEYS.detail(updatedInvoice.id!),
        updatedInvoice
      );
      
      // Invalidate invoices list to refresh
      queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEYS.lists() });
      
      toast({
        title: "Success",
        description: `Invoice ${updatedInvoice.invoiceNumber} updated successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice",
        variant: "destructive",
      });
    },
  });
};

// Delete invoice mutation
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceApi.deleteInvoice,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: INVOICE_QUERY_KEYS.detail(deletedId) });
      
      // Invalidate invoices list
      queryClient.invalidateQueries({ queryKey: INVOICE_QUERY_KEYS.lists() });
      
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });
};

// Generate PDF mutation
export const useGenerateInvoicePDF = () => {
  return useMutation({
    mutationFn: invoiceApi.getInvoicePDF,
    onSuccess: (blob, invoiceId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    },
  });
};