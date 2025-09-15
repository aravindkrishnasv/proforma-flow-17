import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Edit, Trash2, Search, Plus, Printer } from "lucide-react";
import { useInvoices, useDeleteInvoice, useGenerateInvoicePDF } from "@/hooks/useInvoices";
import { Invoice, InvoiceItem } from "@/services/invoiceApi";
import { ToWords } from "to-words";

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});

const InvoiceList = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "InvoiceList";
  },[]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useInvoices();
  const invoices = data || [];
  const deleteInvoiceMutation = useDeleteInvoice();
  const generatePDFMutation = useGenerateInvoicePDF();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    navigate(`/edit-invoice/${invoice.id}`);
  };

  const handleDelete = (invoice: Invoice) => {
    if (!invoice.id) return;

    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      deleteInvoiceMutation.mutate(invoice.id);
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-preview-content")!.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
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
    <>
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
                            onClick={() => handlePreview(invoice)}
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

      {selectedInvoice && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1">
              <div className="p-6" id="invoice-preview-content">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedInvoice.sellerCompanyName}</h2>
                    <p className="text-muted-foreground">{selectedInvoice.sellerAddress}</p>
                    <p className="text-muted-foreground">{selectedInvoice.sellerEmail} | {selectedInvoice.sellerPhone}</p>
                    <p className="text-muted-foreground">GSTIN: {selectedInvoice.sellerGSTIN}</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-4xl font-bold text-primary">INVOICE</h1>
                    <p className="text-lg">{selectedInvoice.invoiceNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold mb-2 text-muted-foreground">BILL TO</h3>
                    <p className="font-bold">{selectedInvoice.buyerName}</p>
                    <p>{selectedInvoice.buyerAddress}</p>
                    <p>{selectedInvoice.buyerEmail}</p>
                    <p>{selectedInvoice.buyerPhone}</p>
                    {selectedInvoice.buyerGSTIN && <p>GSTIN: {selectedInvoice.buyerGSTIN}</p>}
                  </div>
                  <div className="text-right">
                      <p><strong className="text-muted-foreground">Invoice Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                      <p><strong className="text-muted-foreground">Due Date:</strong> {selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item: InvoiceItem) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{(item.quantity * item.rate).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-end mt-8">
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between"><span>Subtotal:</span><span>₹{selectedInvoice.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>GST Amount:</span><span>₹{selectedInvoice.totalTax.toFixed(2)}</span></div>
                    <div className="border-t my-2"></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>₹{selectedInvoice.totalAmount.toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="font-semibold">Amount in Words:</p>
                  <p className="text-muted-foreground">{toWords.convert(selectedInvoice.totalAmount)}</p>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="p-6 pt-0 border-t">
              <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
              </Button>
              <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default InvoiceList;