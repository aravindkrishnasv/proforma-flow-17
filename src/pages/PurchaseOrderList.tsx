import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { PurchaseOrder } from "@/types";
import { Badge } from "@/components/ui/badge";

const PurchaseOrderList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const data = await accountsPayableApi.getPurchaseOrders();
        const formattedData = data.map(po => ({
          ...po,
          total_amount: parseFloat(po.total_amount as any),
          advance_payment: parseFloat(po.advance_payment as any),
        }));
        setPurchaseOrders(formattedData);
      } catch (error) {
        console.error("Failed to fetch purchase orders", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchaseOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading purchase orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
        <Link to="/create-purchase-order">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Advance Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>{po.po_number}</TableCell>
                  <TableCell>{po.vendor_id}</TableCell>
                  <TableCell>₹{po.total_amount.toFixed(2)}</TableCell>
                  <TableCell>₹{po.advance_payment.toFixed(2)}</TableCell>
                  <TableCell><Badge>{po.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrderList;