import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Repeat, HandCoins, ReceiptIndianRupee } from "lucide-react";

const AccountsReceivablePortal = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Accounts Receivable</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage your customer information.
            </p>
            <Link to="/customers">
              <Button>Go to Customers</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create and manage customer invoices.
            </p>
            <Link to="/invoices">
              <Button>Go to Invoices</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandCoins className="h-5 w-5" />
              Payments Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track payments received from customers.
            </p>
            <Link to="/payments-received">
              <Button>Go to Payments</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Estimates / Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create and send quotes to your customers.
            </p>
            <Link to="/estimates">
              <Button variant="outline">View Estimates</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Recurring Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage scheduled invoices for subscriptions.
            </p>
            <Link to="/recurring-invoices">
              <Button variant="outline">View Recurring</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptIndianRupee className="h-5 w-5" />
              Credit Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Issue credits and manage customer returns.
            </p>
            <Link to="/credit-notes">
              <Button variant="outline">View Credit Notes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountsReceivablePortal;