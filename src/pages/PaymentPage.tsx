import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { accountsPayableApi } from "@/services/accountsPayableApi";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBills, bills } = location.state || { selectedBills: [], bills: [] };

  const billsToPay = bills.filter(bill => selectedBills.includes(bill.id));
  const totalAmount = billsToPay.reduce((total, bill) => total + bill.total_amount, 0);

  const handlePayment = async () => {
    try {
        await accountsPayableApi.batchPayBills(selectedBills);
        toast({
            title: "Success",
            description: "Batch payment processed successfully.",
        });
        navigate("/bills"); // Redirect to bills list after payment
    } catch (error) {
        console.error("Failed to process batch payment", error);
        toast({
            title: "Error",
            description: "Failed to process batch payment.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Complete Your Payment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Bills to Pay</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {billsToPay.map(bill => (
                  <li key={bill.id} className="flex justify-between py-2 border-b">
                    <span>Bill #{bill.bill_number}</span>
                    <span>₹{bill.total_amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mock Payment Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input type="text" id="cardNumber" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input type="text" id="expiryDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                    <input type="text" id="cvv" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="123" />
                  </div>
                </div>
                <Button onClick={handlePayment} className="w-full">
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;