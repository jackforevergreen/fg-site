import AppShowcase from "@/components/AppShowcase";
import Community from "@/components/Community";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Newsletter from "@/components/Newsletter";
import Offset from "@/components/Offset";
import YouTubePromo from "@/components/YouTubePromo";
import Business from "@/components/business";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      <Hero />
      <Community />
      <AppShowcase />

      <YouTubePromo />
      <Offset />
      <Business />

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
