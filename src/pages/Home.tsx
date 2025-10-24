import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, FileText, Eye, Languages, MessageSquare, Award, LogIn } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: Languages, label: "Change Language", action: () => navigate("/language") },
    { icon: MessageSquare, label: "Feedback", action: () => navigate("/feedback") },
    { icon: Award, label: "Rewards", action: () => navigate("/rewards") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white border-b shadow-smooth">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold gradient-text"><img src="/favicon.ico" width="35" height="35"></img>FixItNow</h1>
            <p className="text-sm text-muted-foreground">Report, Resolve, Revive</p>
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-display">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="w-full justify-start text-lg"
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-down">
            <h2 className="text-4xl font-display font-bold mb-4">
              Make Your Voice Heard
            </h2>
            <p className="text-lg text-muted-foreground">
              Report civic issues and help build a better community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* File Complaint */}
            <Card 
              className="p-8 hover:shadow-elevation transition-all cursor-pointer group animate-slide-up"
              onClick={() => navigate("/file-complaint")}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">File Complaint</h3>
                <p className="text-muted-foreground">
                  Report a civic issue in your area
                </p>
              </div>
            </Card>

            {/* Track Complaint */}
            <Card 
              className="p-8 hover:shadow-elevation transition-all cursor-pointer group animate-slide-up"
              style={{ animationDelay: "0.1s" }}
              onClick={() => navigate("/track-complaint")}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-success rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">Track Status</h3>
                <p className="text-muted-foreground">
                  Check your complaint status
                </p>
              </div>
            </Card>

            {/* Admin Login */}
            <Card 
              className="p-8 hover:shadow-elevation transition-all cursor-pointer group animate-slide-up"
              style={{ animationDelay: "0.2s" }}
              onClick={() => navigate("/admin-login")}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">Admin Login</h3>
                <p className="text-muted-foreground">
                  Department access portal
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
