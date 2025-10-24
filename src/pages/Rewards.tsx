import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Gift } from "lucide-react";

const Rewards = () => {
  const navigate = useNavigate();
  const [resolvedCount, setResolvedCount] = useState(0);
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const resolvedWithContact = complaints.filter(
      (c: any) => 
        c.status === "resolved" && 
        (c.email || c.phone) && 
        c.name
    );
    
    setResolvedCount(resolvedWithContact.length);
    setIsEligible(resolvedWithContact.length >= 5);
  }, []);

  const progress = Math.min((resolvedCount / 5) * 100, 100);
  const rewardsEarned = Math.floor(resolvedCount / 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-6">
        <Button variant="ghost" onClick={() => navigate("/home")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="max-w-2xl mx-auto p-8 shadow-elevation">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Rewards Program</h1>
            <p className="text-muted-foreground">
              Earn rewards for being an active community member
            </p>
          </div>

          {/* Progress Section */}
          <div className="mb-8 p-6 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Resolved Complaints</span>
              <Badge variant={isEligible ? "default" : "secondary"}>
                {resolvedCount} / 5
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {isEligible
                ? "You're eligible for rewards!"
                : `${5 - resolvedCount} more to unlock your first reward`}
            </p>
          </div>

          {/* Rewards Earned */}
          {rewardsEarned > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Your Rewards
              </h2>
              <div className="space-y-3">
                {Array.from({ length: rewardsEarned }).map((_, index) => (
                  <Card key={index} className="p-4 bg-gradient-success">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <p className="font-semibold">Reward #{index + 1}</p>
                        <p className="text-sm opacity-90">100 MB Free Internet Data</p>
                      </div>
                      <Button size="sm" variant="secondary">
                        Claim
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* How it Works */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">How it Works</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Register complaints with your contact details (name, phone, or email)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Wait for your complaint to be resolved by the department</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Earn 1 reward for every 5 resolved complaints</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>Redeem rewards like free internet data, vouchers, and more</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;
