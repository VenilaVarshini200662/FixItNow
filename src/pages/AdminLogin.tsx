import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const departmentCredentials: Record<string, { password: string; department: string }> = {
    "roads_admin": { password: "roads@2025", department: "roads" },
    "water_admin": { password: "water@2025", department: "water" },
    "electricity_admin": { password: "electricity@2025", department: "electricity" },
    "sanitation_admin": { password: "sanitation@2025", department: "sanitation" },
    "streetlight_admin": { password: "streetlight@2025", department: "streetlight" },
    "drainage_admin": { password: "drainage@2025", department: "drainage" },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const dept = departmentCredentials[credentials.username];
    
    if (dept && dept.password === credentials.password) {
      localStorage.setItem("adminDepartment", dept.department);
      localStorage.setItem("isAdminLoggedIn", "true");
      toast.success("Login successful");
      navigate("/admin-dashboard");
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your username and password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="p-8 shadow-elevation">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Admin Login</h1>
            <p className="text-muted-foreground">Department Access Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label>Username</Label>
              <Input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="department_admin"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Login to Dashboard
            </Button>
          </form>

          
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
