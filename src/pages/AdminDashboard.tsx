import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, MapPin } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const adminDept = localStorage.getItem("adminDepartment");

    if (!isLoggedIn || !adminDept) {
      navigate("/admin-login");
      return;
    }

    setDepartment(adminDept);
    loadComplaints(adminDept);
  }, [navigate]);

  const loadComplaints = (dept: string) => {
    const allComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const deptComplaints = allComplaints.filter((c: any) => c.department === dept);
    
    const sorted = deptComplaints.sort((a: any, b: any) => {
      const getPriority = (complaint: any) => {
        let priority = 0;
        
        const durationInDays = 
          complaint.durationType === "months" 
            ? parseInt(complaint.durationValue) * 30 
            : complaint.durationType === "weeks"
            ? parseInt(complaint.durationValue) * 7
            : parseInt(complaint.durationValue);
        
        priority += durationInDays * 2;
        
        if (complaint.frequency === "often") priority += 100;
        
        priority -= new Date(complaint.createdAt).getTime() / 1000000;
        
        return priority;
      };

      return getPriority(b) - getPriority(a);
    });

    setComplaints(sorted);
  };

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    const allComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const updated = allComplaints.map((c: any) => {
      if (c.id === complaintId) {
        return { ...c, status: newStatus };
      }
      return c;
    });

    localStorage.setItem("complaints", JSON.stringify(updated));
    loadComplaints(department);
    toast.success("Status updated successfully");

    if (newStatus === "resolved") {
      const complaint = allComplaints.find((c: any) => c.id === complaintId);
      if (complaint && complaint.email) {
        toast.info("Notification sent to user");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminDepartment");
    navigate("/admin-login");
  };
   useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-success";
      case "in-progress":
        return "bg-info";
      case "pending":
        return "bg-warning";
      case "rejected":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground capitalize">
              {department.replace("-", " ")} Department
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          {complaints.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No complaints found for this department</p>
            </Card>
          ) : (
            complaints.map((complaint, index) => (
              <Card key={complaint.id} className="p-6 shadow-smooth animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">#{index + 1} Priority</Badge>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{complaint.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Filed on {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => handleStatusUpdate(complaint.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Description:</span> {complaint.description}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Duration:</span> {complaint.durationValue} {complaint.durationType}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Frequency:</span>{" "}
                        <span className="capitalize">{complaint.frequency}</span>
                      </p>
                      {complaint.name && (
                        <p className="text-sm">
                          <span className="font-medium">Contact:</span> {complaint.name}
                          {complaint.phone && ` - ${complaint.phone}`}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      {complaint.imagePreview && (
                        <img
                          src={complaint.imagePreview}
                          alt="Issue"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      {complaint.audioData && (
                        <div>
                          <p className="text-sm font-medium mb-1">Voice Message:</p>
                          <audio controls className="w-full">
                            <source src={complaint.audioData} type="audio/webm" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                      {complaint.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <a
                            href={`https://www.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
