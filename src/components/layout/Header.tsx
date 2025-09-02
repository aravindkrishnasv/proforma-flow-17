import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Home, Plus, BarChart3 } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      name: "Create Invoice",
      href: "/create-invoice", 
      icon: Plus,
    },
    {
      name: "Invoice List",
      href: "/invoices",
      icon: FileText,
    },
  ];

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ProInvoice</span>
          </Link>

          <nav className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;