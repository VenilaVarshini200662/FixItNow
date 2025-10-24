import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback || rating === 0) {
      toast.error("Please provide rating and feedback");
      return;
    }

    const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    feedbacks.push({
      feedback,
      rating,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    toast.success("Thank you for your feedback!");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-6">
        <Button variant="ghost" onClick={() => navigate("/home")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="max-w-2xl mx-auto p-8 shadow-elevation">
          <h1 className="text-3xl font-display font-bold mb-6">Share Your Feedback</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-3 block">Rate your experience</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-transform hover:scale-110 ${
                      star <= rating ? "text-warning" : "text-muted"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Your Feedback</Label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
