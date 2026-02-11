import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ReasonsSection from "@/components/ReasonsSection";
import CodenamesSection from "@/components/CodenamesSection";

const Index = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onAccept={scrollToDashboard} />
      <div ref={dashboardRef}>
        <ReasonsSection />
        <CodenamesSection />
        <footer className="py-12 text-center">
          <p className="font-serif text-sm italic text-muted-foreground">
            Made with all my love, just for you 💕
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
