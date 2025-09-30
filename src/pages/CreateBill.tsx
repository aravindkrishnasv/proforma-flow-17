import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { toast } from "@/hooks/use-toast";
import { Vendor, PurchaseOrder, BillItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";


const CreateBill = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [billNumber, setBillNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [formData, setFormData] = useState({
    vendor_id: "",
    purchase_order_id: "",
    bill_date: new Date().toISOString().split("T")[0],
    due_date: "",
    status: "unpaid" as const,
    recurrence_frequency: 'monthly',
  });

  useEffect(() => {
    const billDate = new Date(formData.bill_date);
    const dueDate = new Date(billDate.setMonth(billDate.getMonth() + 1));
    setFormData((prev) => ({
      ...prev,
      due_date: dueDate.toISOString().split("T")[0],
    }));
  }, [formData.bill_date]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsData, poData, billCountData] = await Promise.all([
          accountsPayableApi.getVendors(),
          accountsPayableApi.getPurchaseOrders(),
          accountsPayableApi.getBillCount(),
        ]);
        setVendors(vendorsData);
        setPurchaseOrders(poData);
        const currentYear = new Date().getFullYear();
        const newCount = billCountData.count + 1;
        setBillNumber(`BILL-${currentYear}-${String(newCount).padStart(3, "0")}`);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({
          title: "Error",
          description: "Failed to fetch initial data",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPurchaseOrderItems = async () => {
      if (formData.purchase_order_id) {
        try {
          const po = await accountsPayableApi.getPurchaseOrder(
            formData.purchase_order_id
          );
          if (po && po.items) {
            setItems(po.items);
            setTotalAmount(parseFloat(po.total_amount as any));
          }
        } catch (error) {
          console.error("Failed to fetch purchase order items", error);
          toast({
            title: "Error",
            description: "Failed to fetch purchase order items",
            variant: "destructive",
          });
        }
      } else {
        setItems([]);
        setTotalAmount(0);
      }
    };
    fetchPurchaseOrderItems();
  }, [formData.purchase_order_id]);

  const handleSave = async () => {
    if (!billNumber || !formData.vendor_id || !formData.purchase_order_id) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const billData = {
      ...formData,
      bill_number: billNumber,
      vendor_id: parseInt(formData.vendor_id),
      purchase_order_id: parseInt(formData.purchase_order_id),
      items,
      total_amount: totalAmount,
      is_recurring: isRecurring,
      recurrence_frequency: isRecurring ? formData.recurrence_frequency : '',
    };

    try {
      await accountsPayableApi.createBill(billData);
      toast({
        title: "Success",
        description: "Bill created successfully",
      });
      navigate("/bills");
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
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bill_number">Bill Number *</Label>
                <Input
                  id="bill_number"
                  value={billNumber}
                  disabled
                  className="bg-muted"
                />
              </div>
              <Button onClick={() => setIsModalOpen(true)}>
                Select Vendor and PO
              </Button>
              <div>
                <Label htmlFor="bill_date">Bill Date</Label>
                <Input
                  id="bill_date"
                  type="date"
                  value={formData.bill_date}
                  onChange={(e) =>
                    setFormData({ ...formData, bill_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="due_date">Due Date *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                <Label htmlFor="recurring">This is a recurring bill</Label>
              </div>
              {isRecurring && (
                <div>
                    <Label htmlFor="recurrence_frequency">Frequency</Label>
                    <Select onValueChange={(value) => setFormData({...formData, recurrence_frequency: value})} value={formData.recurrence_frequency}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Items from Purchase Order</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Select a purchase order to see the items.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.rate.toFixed(2)}</TableCell>
                        <TableCell>
                          ₹{(item.quantity * item.rate).toFixed(2)}
                        </TableCell>
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
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Bill
          </Button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Vendor and Purchase Order</DialogTitle>
            <DialogDescription>
              Select a vendor first, then the corresponding purchase order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vendor_id">Vendor *</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, vendor_id: value })
                }
                value={formData.vendor_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={String(vendor.id)}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="purchase_order_id">Purchase Order *</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, purchase_order_id: value })
                }
                value={formData.purchase_order_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a purchase order" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders
                    .filter(
                      (po) =>
                        po.vendor_id === parseInt(formData.vendor_id, 10)
                    )
                    .map((po) => (
                      <SelectItem key={po.id} value={String(po.id)}>
                        {po.po_number}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setIsModalOpen(false)}>Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBill;