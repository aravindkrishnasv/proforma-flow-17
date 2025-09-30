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
import { Vendor, PurchaseOrderItem, PurchaseOrder } from "@/types";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [poNumber, setPoNumber] = useState("");
  const [formData, setFormData] = useState({
    vendor_id: "",
    advance_payment: 0,
    status: "draft" as PurchaseOrder['status'],
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [vendorsData, poCountData] = await Promise.all([
          accountsPayableApi.getVendors(),
          accountsPayableApi.getPurchaseOrderCount(),
        ]);
        setVendors(vendorsData.filter(v => v.status === 'approved'));
        const currentYear = new Date().getFullYear();
        const newCount = poCountData.count + 1;
        setPoNumber(`PO-${currentYear}-${String(newCount).padStart(3, '0')}`);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
        toast({
          title: "Error",
          description: "Failed to fetch initial data",
          variant: "destructive",
        });
      }
    };
    fetchInitialData();
  }, []);

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
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

  const updateItem = (id: string, field: keyof PurchaseOrderItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleSave = async () => {
    if (!poNumber || !formData.vendor_id || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    const purchaseOrderData = {
      ...formData,
      po_number: poNumber,
      vendor_id: parseInt(formData.vendor_id),
      items,
      total_amount: calculateTotal(),
    };

    try {
      await accountsPayableApi.createPurchaseOrder(purchaseOrderData);
      toast({
        title: "Success",
        description: "Purchase Order created successfully",
      });
      navigate('/purchase-orders');
    } catch (error) {
      console.error("Failed to create purchase order:", error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Create Purchase Order</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="po_number">PO Number *</Label><Input id="po_number" value={poNumber} disabled className="bg-muted" /></div>
              <div>
                <Label htmlFor="vendor_id">Vendor *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, vendor_id: value })} value={formData.vendor_id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an approved vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={String(vendor.id)}>{vendor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div><Label htmlFor="advance_payment">Advance Payment</Label><Input id="advance_payment" type="number" value={formData.advance_payment} onChange={(e) => setFormData({ ...formData, advance_payment: parseFloat(e.target.value) || 0 })} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Items</CardTitle><Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-2" />Add Item</Button></CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No items added yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
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
          <Button onClick={handleSave} className="w-full"><Save className="h-4 w-4 mr-2" />Save Purchase Order</Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;