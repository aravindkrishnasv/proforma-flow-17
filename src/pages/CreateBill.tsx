import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { toast } from "@/hooks/use-toast";
import { Vendor, PurchaseOrder, BillItem } from "@/types";

const CreateBill = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [formData, setFormData] = useState({
    bill_number: "",
    vendor_id: "",
    purchase_order_id: "",
    bill_date: new Date().toISOString().split('T')[0],
    due_date: "",
    status: "unpaid" as const,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsData, poData] = await Promise.all([
          accountsPayableApi.getVendors(),
          accountsPayableApi.getPurchaseOrders(),
        ]);
        setVendors(vendorsData);
        setPurchaseOrders(poData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({
          title: "Error",
          description: "Failed to fetch vendors or purchase orders",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      rate: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BillItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleSave = async () => {
    if (!formData.bill_number || !formData.vendor_id || !formData.purchase_order_id || !formData.due_date || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    const billData = {
      ...formData,
      vendor_id: parseInt(formData.vendor_id),
      purchase_order_id: parseInt(formData.purchase_order_id),
      items,
      total_amount: calculateTotal(),
    };

    try {
      await accountsPayableApi.createBill(billData);
      toast({
        title: "Success",
        description: "Bill created successfully",
      });
      navigate('/bills');
    } catch (error) {
      console.error("Failed to create bill:", error);
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Bill</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Bill Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="bill_number">Bill Number *</Label><Input id="bill_number" value={formData.bill_number} onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })} placeholder="Enter bill number" required /></div>
              <div>
                <Label htmlFor="vendor_id">Vendor *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, vendor_id: value })} value={formData.vendor_id}>
                  <SelectTrigger><SelectValue placeholder="Select a vendor" /></SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={String(vendor.id)}>{vendor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="purchase_order_id">Purchase Order *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, purchase_order_id: value })} value={formData.purchase_order_id}>
                  <SelectTrigger><SelectValue placeholder="Select a purchase order" /></SelectTrigger>
                  <SelectContent>
                    {purchaseOrders.map(po => (
                      <SelectItem key={po.id} value={String(po.id)}>{po.po_number}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="bill_date">Bill Date</Label><Input id="bill_date" type="date" value={formData.bill_date} onChange={(e) => setFormData({ ...formData, bill_date: e.target.value })} /></div>
              <div><Label htmlFor="due_date">Due Date *</Label><Input id="due_date" type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Items</CardTitle><Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-2" />Add Item</Button></CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No items added yet.</div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Item Name</TableHead><TableHead>Qty</TableHead><TableHead>Rate</TableHead><TableHead>Total</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="Item name" /></TableCell>
                        <TableCell><Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} min="1" className="w-20" /></TableCell>
                        <TableCell><Input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} min="0" step="0.01" className="w-24" /></TableCell>
                        <TableCell>₹{(item.quantity * item.rate).toFixed(2)}</TableCell>
                        <TableCell><Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-between font-bold"><span>Total:</span><span>₹{calculateTotal().toFixed(2)}</span></div>
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="w-full"><Save className="h-4 w-4 mr-2" />Save Bill</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;