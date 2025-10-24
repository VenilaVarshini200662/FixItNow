import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";

const TrackComplaint = () => {
  const navigate = useNavigate();
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState<any>(null);

  const handleSearch = () => {
    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const found = complaints.find((c: any) => c.id === complaintId);

    if (found) {
      setComplaint(found);
    } else {
      toast.error("Complaint not found", {
        description: "Please check your complaint ID and try again",
      });
      setComplaint(null);
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
        <Button variant="ghost" onClick={() => navigate("/home")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="max-w-2xl mx-auto p-8 shadow-elevation">
          <h1 className="text-3xl font-display font-bold mb-6">Track Complaint Status</h1>

          <div className="space-y-4 mb-8">
            <div>
              <Label>Enter Complaint ID</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value)}
                  placeholder="FIN-1234567890"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {complaint && (
            <div className="space-y-4 animate-slide-up">
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Complaint Details</h2>
                  <Badge className={getStatusColor(complaint.status)}>
                    {complaint.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Complaint ID:</span>{" "}
                    <span className="text-muted-foreground">{complaint.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">Department:</span>{" "}
                    <span className="text-muted-foreground capitalize">{complaint.department}</span>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    <span className="text-muted-foreground">{complaint.description}</span>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>{" "}
                    <span className="text-muted-foreground">
                      {complaint.durationValue} {complaint.durationType}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span>{" "}
                    <span className="text-muted-foreground capitalize">{complaint.frequency}</span>
                  </div>
                  <div>
                    <span className="font-medium">Filed on:</span>{" "}
                    <span className="text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {complaint.imagePreview && (
                    <div>
                      <span className="font-medium block mb-2">Photo:</span>
                      <img
                        src={complaint.imagePreview}
                        alt="Issue"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {complaint.audioData && (
                    <div>
                      <span className="font-medium block mb-2">Voice Message:</span>
                      <audio controls className="w-full">
                        <source src={complaint.audioData} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TrackComplaint;
