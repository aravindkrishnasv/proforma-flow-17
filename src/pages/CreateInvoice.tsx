import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Eye, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { InvoiceItem } from "@/services/invoiceApi";
import {useEffect} from "react";
import numWords from "num-words";
const CreateInvoice = () => {
  useEffect(() => {
    document.title = "Create-Invoice";
  },[]);
  const navigate = useNavigate();
  const createInvoiceMutation = useCreateInvoice();
  const [formData, setFormData] = useState({
    // Seller Details
    sellerCompanyName: "",
    sellerAddress: "",
    sellerPhone: "",
    sellerEmail: "",
    sellerGSTIN: "",
    
    // Buyer Details  
    buyerName: "",
    buyerAddress: "",
    buyerPhone: "",
    buyerEmail: "",
    buyerGSTIN: "",
    
    invoiceDate: new Date().toISOString().split('T')[0],
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

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
    // Simple implementation - in real app, use a proper number-to-words library
    if (amount === 0) return "Zero Rupees Only";
    return `${amount.toFixed(2)} Rupees Only`;
  };

  const getDueDate = () => {
    const invoiceDate = new Date(formData.invoiceDate);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30);
    return dueDate.toISOString().split('T')[0];
  };

  const handleSave = () => {
    if (!formData.sellerGSTIN || !formData.sellerCompanyName || !formData.buyerName || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: formData.invoiceDate,
      dueDate: getDueDate(),
      ...formData,
      items,
      subtotal,
      totalTax,
      totalAmount: total,
      status: "draft" as const,
    };

    createInvoiceMutation.mutate(invoiceData, {
      onSuccess: (newInvoice) => {
        navigate('/invoices');
      },
    });
  };

  const handlePreview = () => {
    if (!formData.sellerGSTIN || !formData.sellerCompanyName || !formData.buyerName || items.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please fill all required fields and add at least one item to preview.",
        variant: "destructive",
      });
      return;
    }

    // Here you would show a preview modal or navigate to preview page
    toast({
      title: "Preview",
      description: "Preview functionality will be available once backend is connected.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Proforma Invoice</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Seller Details */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sellerCompanyName">Company Name *</Label>
                <Input
                  id="sellerCompanyName"
                  value={formData.sellerCompanyName}
                  onChange={(e) => setFormData({...formData, sellerCompanyName: e.target.value})}
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sellerAddress">Address</Label>
                <Textarea
                  id="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={(e) => setFormData({...formData, sellerAddress: e.target.value})}
                  placeholder="Enter company address"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellerPhone">Phone Number</Label>
                  <Input
                    id="sellerPhone"
                    value={formData.sellerPhone}
                    onChange={(e) => setFormData({...formData, sellerPhone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="sellerEmail">Email</Label>
                  <Input
                    id="sellerEmail"
                    type="email"
                    value={formData.sellerEmail}
                    onChange={(e) => setFormData({...formData, sellerEmail: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="sellerGSTIN">GSTIN *</Label>
                <Input
                  id="sellerGSTIN"
                  value={formData.sellerGSTIN}
                  onChange={(e) => setFormData({...formData, sellerGSTIN: e.target.value})}
                  placeholder="Enter seller GSTIN"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Buyer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Buyer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buyerName">Customer Name *</Label>
                <Input
                  id="buyerName"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="buyerAddress">Address</Label>
                <Textarea
                  id="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={(e) => setFormData({...formData, buyerAddress: e.target.value})}
                  placeholder="Enter customer address"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyerPhone">Phone Number</Label>
                  <Input
                    id="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={(e) => setFormData({...formData, buyerPhone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="buyerEmail">Email</Label>
                  <Input
                    id="buyerEmail"
                    type="email"
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({...formData, buyerEmail: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="buyerGSTIN">GSTIN</Label>
                <Input
                  id="buyerGSTIN"
                  value={formData.buyerGSTIN}
                  onChange={(e) => setFormData({...formData, buyerGSTIN: e.target.value})}
                  placeholder="Enter buyer GSTIN"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Date Section */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    value={getDueDate()}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Items</CardTitle>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items added yet. Click "Add Item" to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Tax %</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            placeholder="Item name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.taxPercent}
                            onChange={(e) => updateItem(item.id, 'taxPercent', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          ₹{calculateItemTotal(item).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Amount:</span>
                <span>₹{totalTax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <strong>Amount in Words:</strong>
                <p className="mt-1">{convertToWords(total)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button onClick={handlePreview} variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Preview Invoice
            </Button>
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;