import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VendorPortal = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Vendor Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Onboard as a New Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Join our network of trusted vendors.
            </p>
            <Link to="/vendor-onboarding">
              <Button>Onboard Now</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Submit an Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Already a vendor? Submit your invoice here.
            </p>
            <Link to="/submit-invoice">
              <Button>Submit Invoice</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorPortal;