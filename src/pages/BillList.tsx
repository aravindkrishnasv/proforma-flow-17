import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { accountsPayableApi } from "@/services/accountsPayableApi";
import { Bill } from "@/types";

const BillList = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await accountsPayableApi.getBills();
        setBills(data);
      } catch (error) {
        console.error("Failed to fetch bills", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBills();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading bills...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Bills</h1>
        <Link to="/create-bill">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Number</TableHead>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.bill_number}</TableCell>
                  <TableCell>{bill.vendor_id}</TableCell>
                  <TableCell>{new Date(bill.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>₹{bill.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{bill.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillList;