import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Save, Eye, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useInvoice, useUpdateInvoice } from "@/hooks/useInvoices";
import { InvoiceItem } from "@/services/invoiceApi";
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

const EditInvoice = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: invoice, isLoading, error } = useInvoice(id!);
    const updateInvoiceMutation = useUpdateInvoice();

    const [formData, setFormData] = useState({
        sellerCompanyName: "",
        sellerAddress: "",
        sellerPhone: "",
        sellerEmail: "",
        sellerGSTIN: "",
        buyerName: "",
        buyerAddress: "",
        buyerPhone: "",
        buyerEmail: "",
        buyerGSTIN: "",
        invoiceDate: new Date().toISOString().split('T')[0],
    });
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (invoice) {
            document.title = `Edit Invoice - ${invoice.invoiceNumber}`;
            setInvoiceNumber(invoice.invoiceNumber);
            setFormData({
                sellerCompanyName: invoice.sellerCompanyName,
                sellerAddress: invoice.sellerAddress,
                sellerPhone: invoice.sellerPhone,
                sellerEmail: invoice.sellerEmail,
                sellerGSTIN: invoice.sellerGSTIN,
                buyerName: invoice.buyerName,
                buyerAddress: invoice.buyerAddress,
                buyerPhone: invoice.buyerPhone,
                buyerEmail: invoice.buyerEmail,
                buyerGSTIN: invoice.buyerGSTIN,
                invoiceDate: new Date(invoice.invoiceDate).toISOString().split('T')[0],
            });
            if (typeof invoice.items === 'string') {
                setItems(JSON.parse(invoice.items));
            } else {
                setItems(Array.isArray(invoice.items) ? invoice.items : []);
            }
        }
    }, [invoice]);

    const addItem = () => {
        const newItem: InvoiceItem = {
          id: Date.now().toString(),
          name: "",
          quantity: 1,
          rate: 0,
          taxPercent: 18,
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateItemTotal = (item: InvoiceItem) => {
        const subtotal = item.quantity * item.rate;
        const taxAmount = (subtotal * item.taxPercent) / 100;
        return subtotal + taxAmount;
    };

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const totalTax = items.reduce((sum, item) => {
          const itemSubtotal = item.quantity * item.rate;
          return sum + (itemSubtotal * item.taxPercent) / 100;
        }, 0);
        const total = subtotal + totalTax;
        
        return { subtotal, totalTax, total };
    };

    const { subtotal, totalTax, total } = calculateTotals();

    const convertToWords = (amount: number): string => {
        if (amount === 0) return "Zero Rupees Only";
        return toWords.convert(amount);
    };

    const getDueDate = () => {
        const invoiceDate = new Date(formData.invoiceDate);
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + 30);
        return dueDate.toISOString().split('T')[0];
    };

    const handleUpdate = async () => {
        if (!id) return;

        const invoiceData = {
          invoiceNumber: invoice!.invoiceNumber,
          invoiceDate: formData.invoiceDate,
          dueDate: getDueDate(),
          ...formData,
          items,
          subtotal,
          totalTax,
          totalAmount: total,
          status: invoice!.status,
        };

        try {
            await updateInvoiceMutation.mutateAsync({ id, data: invoiceData });
            toast({ title: "Success", description: "Invoice updated successfully." });
            navigate('/invoices');
        } catch (error) {
            toast({ title: "Error", description: "Failed to update invoice.", variant: "destructive" });
            console.error("Failed to update invoice:", error);
        }
    };

    const handlePreview = () => {
        setIsPreviewOpen(true);
    };

    const handlePrint = () => {
        const printContents = document.getElementById("invoice-preview-content")!.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    if (isLoading) return <div className="container mx-auto p-8 text-center">Loading editor...</div>;
    if (error) return <div className="container mx-auto p-8 text-center text-red-500">Error loading invoice for editing.</div>;
    if (!invoice) return <div className="container mx-auto p-8 text-center">Invoice not found.</div>;

    return (
        <>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-foreground mb-8">Edit Invoice {invoice?.invoiceNumber}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Seller Details */}
                        <Card>
                            <CardHeader><CardTitle>Seller Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="sellerCompanyName">Company Name *</Label><Input id="sellerCompanyName" value={formData.sellerCompanyName} onChange={(e) => setFormData({...formData, sellerCompanyName: e.target.value})} placeholder="Enter company name" required /></div>
                                <div><Label htmlFor="sellerAddress">Address</Label><Textarea id="sellerAddress" value={formData.sellerAddress} onChange={(e) => setFormData({...formData, sellerAddress: e.target.value})} placeholder="Enter company address" rows={3}/></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="sellerPhone">Phone Number</Label><Input id="sellerPhone" value={formData.sellerPhone} onChange={(e) => setFormData({...formData, sellerPhone: e.target.value})} placeholder="Enter phone number"/></div>
                                    <div><Label htmlFor="sellerEmail">Email</Label><Input id="sellerEmail" type="email" value={formData.sellerEmail} onChange={(e) => setFormData({...formData, sellerEmail: e.target.value})} placeholder="Enter email address"/></div>
                                </div>
                                <div><Label htmlFor="sellerGSTIN">GSTIN *</Label><Input id="sellerGSTIN" value={formData.sellerGSTIN} onChange={(e) => setFormData({...formData, sellerGSTIN: e.target.value})} placeholder="Enter seller GSTIN" required/></div>
                            </CardContent>
                        </Card>

                        {/* Buyer Details */}
                        <Card>
                            <CardHeader><CardTitle>Buyer Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="buyerName">Customer Name *</Label><Input id="buyerName" value={formData.buyerName} onChange={(e) => setFormData({...formData, buyerName: e.target.value})} placeholder="Enter customer name" required/></div>
                                <div><Label htmlFor="buyerAddress">Address</Label><Textarea id="buyerAddress" value={formData.buyerAddress} onChange={(e) => setFormData({...formData, buyerAddress: e.target.value})} placeholder="Enter customer address" rows={3}/></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="buyerPhone">Phone Number</Label><Input id="buyerPhone" value={formData.buyerPhone} onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})} placeholder="Enter phone number"/></div>
                                    <div><Label htmlFor="buyerEmail">Email</Label><Input id="buyerEmail" type="email" value={formData.buyerEmail} onChange={(e) => setFormData({...formData, buyerEmail: e.target.value})} placeholder="Enter email address"/></div>
                                </div>
                                <div><Label htmlFor="buyerGSTIN">GSTIN</Label><Input id="buyerGSTIN" value={formData.buyerGSTIN} onChange={(e) => setFormData({...formData, buyerGSTIN: e.target.value})} placeholder="Enter buyer GSTIN"/></div>
                            </CardContent>
                        </Card>

                        {/* Invoice Details */}
                        <Card>
                            <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><Label>Invoice Number</Label><Input value={invoiceNumber} disabled className="bg-muted"/></div>
                                <div><Label htmlFor="invoiceDate">Invoice Date</Label><Input id="invoiceDate" type="date" value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}/></div>
                                <div><Label>Due Date</Label><Input value={getDueDate()} disabled className="bg-muted"/></div>
                            </div>
                            </CardContent>
                        </Card>
                        
                        {/* Items Section */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Items</CardTitle><Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-2" />Add Item</Button></CardHeader>
                            <CardContent>{items.length === 0 ? (<div className="text-center py-8 text-muted-foreground">No items added yet.</div>) : (<Table><TableHeader><TableRow><TableHead>Item Name</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>Tax %</TableHead><TableHead>Total</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{items.map((item) => (<TableRow key={item.id}><TableCell><Input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="Item name"/></TableCell><TableCell><Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} min="1" className="w-20"/></TableCell><TableCell><Input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} min="0" step="0.01" className="w-24"/></TableCell><TableCell><Input type="number" value={item.taxPercent} onChange={(e) => updateItem(item.id, 'taxPercent', parseFloat(e.target.value) || 0)} min="0" max="100" step="0.01" className="w-20"/></TableCell><TableCell>₹{calculateItemTotal(item).toFixed(2)}</TableCell><TableCell><Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}</TableBody></Table>)}</CardContent>
                        </Card>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Invoice Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>GST Amount:</span><span>₹{totalTax.toFixed(2)}</span></div>
                                <div className="border-t pt-2"><div className="flex justify-between font-bold"><span>Total:</span><span>₹{total.toFixed(2)}</span></div></div>
                                <div className="text-sm text-muted-foreground"><strong>Amount in Words:</strong><p className="mt-1">{convertToWords(total)}</p></div>
                            </CardContent>
                        </Card>
                        <div className="space-y-3">
                            <Button onClick={handlePreview} variant="outline" className="w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview Invoice
                            </Button>
                            <Button onClick={handleUpdate} className="w-full"><Save className="h-4 w-4 mr-2" />Update Invoice</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Invoice Preview</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1">
                    <div className="p-6" id="invoice-preview-content">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h2 className="text-3xl font-bold">{formData.sellerCompanyName}</h2>
                          <p className="text-muted-foreground">{formData.sellerAddress}</p>
                          <p className="text-muted-foreground">{formData.sellerEmail} | {formData.sellerPhone}</p>
                          <p className="text-muted-foreground">GSTIN: {formData.sellerGSTIN}</p>
                        </div>
                        <div className="text-right">
                          <h1 className="text-4xl font-bold text-primary">INVOICE</h1>
                          <p className="text-lg">{invoiceNumber}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <h3 className="font-semibold mb-2 text-muted-foreground">BILL TO</h3>
                          <p className="font-bold">{formData.buyerName}</p>
                          <p>{formData.buyerAddress}</p>
                          <p>{formData.buyerEmail}</p>
                          <p>{formData.buyerPhone}</p>
                          {formData.buyerGSTIN && <p>GSTIN: {formData.buyerGSTIN}</p>}
                        </div>
                        <div className="text-right">
                            <p><strong className="text-muted-foreground">Invoice Date:</strong> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
                            <p><strong className="text-muted-foreground">Due Date:</strong> {getDueDate()}</p>
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
                          {items.map((item) => (
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
                          <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span>GST Amount:</span><span>₹{totalTax.toFixed(2)}</span></div>
                          <div className="border-t my-2"></div>
                          <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <p className="font-semibold">Amount in Words:</p>
                        <p className="text-muted-foreground">{convertToWords(total)}</p>
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
        </>
    );
};

export default EditInvoice;