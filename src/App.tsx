import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { YouTubeProvider } from "@/lib/youtube/youtube-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { blogRoutes } from "./routes/blogRoutes";
import Methodology from "./components/Methodology";
import About from "./pages/About";
import CarbonCalculator from "./pages/CarbonCalculator";
import Cart from "./pages/Cart";
import Certificates from "./pages/Certificates";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Courses from "./pages/Courses";
import Flights from "./pages/Flights";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import CarbonCredis from "./pages/Shop";
import Subscriptions from "./pages/Subscriptions";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Faq from "./pages/Faq";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <YouTubeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/carboncredits" element={<CarbonCredis />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              {/* Blog Routes */}
              {blogRoutes}
              <Route path="/course" element={<Courses />} />
              <Route path="/about" element={<About />} />
              <Route path="/carbon-calculator" element={<CarbonCalculator />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/flight-offset" element={<Flights />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/methodology" element={<Methodology />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </YouTubeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
