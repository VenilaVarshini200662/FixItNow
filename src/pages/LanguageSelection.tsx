import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

const languages = [
  { code: "ta", name: "தமிழ்", englishName: "Tamil" },
  { code: "en", name: "English", englishName: "English" },
  { code: "hi", name: "हिन्दी", englishName: "Hindi" },
];

const LanguageSelection = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (code: string) => {
    localStorage.setItem("selectedLanguage", code);
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-elevation animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            FixItNow
          </h1>
          <p className="text-muted-foreground">
            Select your preferred language
          </p>
        </div>

        <div className="space-y-3">
          {languages.map((lang, index) => (
            <Button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              variant="outline"
              className="w-full h-16 text-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="font-semibold">{lang.name}</span>
              <span className="ml-2 text-sm opacity-70">({lang.englishName})</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LanguageSelection;
