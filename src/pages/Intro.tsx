import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/language");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 animate-fade-in">
        <div className="mb-8 animate-scale-in">
          <h1 className="font-display font-black text-7xl md:text-9xl text-white mb-4 tracking-tight">
            FixItNow
          </h1>
          <div className="h-1 w-32 mx-auto bg-white/30 rounded-full mb-6" />
          <p className="font-display text-2xl md:text-4xl text-white/90 font-semibold tracking-wide">
            Report, Resolve, Revive
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2 justify-center mt-12 animate-slide-up">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

export default Intro;
