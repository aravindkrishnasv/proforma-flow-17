import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Search, Download, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useInvoices, useDeleteInvoice, useGenerateInvoicePDF } from "@/hooks/useInvoices";
import { Invoice } from "@/services/invoiceApi";
import { useEffect } from "react";

const InvoiceList = () => {
  useEffect(() => {
    document.title = "InvoiceList";
  },[]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useInvoices();
  const invoices = data || [];
  const deleteInvoiceMutation = useDeleteInvoice();
  const generatePDFMutation = useGenerateInvoicePDF();

  const filteredInvoices = invoices.filter(invoice =>
    invoice.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleView = (invoice: Invoice) => {
    // TODO: Navigate to invoice view page or open modal
    toast({
      title: "View Invoice",
      description: `Viewing invoice ${invoice.invoiceNumber}`,
    });
  };

  const handleEdit = (invoice: Invoice) => {
    // TODO: Navigate to edit invoice page
    toast({
      title: "Edit Invoice",
      description: `Editing invoice ${invoice.invoiceNumber}`,
    });
  };

  const handleDelete = (invoice: Invoice) => {
    if (!invoice.id) return;
    
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      deleteInvoiceMutation.mutate(invoice.id);
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    if (!invoice.id) return;
    generatePDFMutation.mutate(invoice.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading invoices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-lg font-semibold text-amber-600 mb-4">
                Backend Connection Required
              </div>
              <div className="text-muted-foreground mb-4">
                The frontend is ready but no backend API is running yet.
              </div>
              <div className="text-sm text-muted-foreground mb-6">
                Please start your pgAdmin-connected backend server at <code className="bg-muted px-2 py-1 rounded">/api/invoices</code>
              </div>
              <Link to="/create-invoice">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Test Invoice Creation Form
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Invoice List</h1>
        <Link to="/create-invoice">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Invoice
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {invoices.length === 0 ? (
                <>
                  No invoices found. <a href="/create-invoice" className="text-primary hover:underline">Create your first invoice</a>
                </>
              ) : (
                "No invoices match your search criteria."
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No.</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Due Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.buyerName}</TableCell>
                    <TableCell>
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>₹{invoice.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(invoice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(invoice)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceList;