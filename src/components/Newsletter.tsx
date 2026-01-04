// components/Newsletter.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveNewsletterSubscription } from "@/lib/services/newsletterService";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await saveNewsletterSubscription(email);
      toast.success("Thanks for subscribing! Check your email for confirmation.");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card to-accent/20 shadow-[var(--shadow-card)] border-0 text-center rounded-2xl">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-forest rounded-full flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-button)]">
              <Mail className="h-8 w-8 text-primary-foreground" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Join the <span className="text-primary">Newsletter</span>
            </h2>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Occasional emails about what we shipped, milestones on the
              roadmap, and the climate impact we’re making—no tutorials, no
              fluff.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 rounded-xl border-2 border-input focus:border-primary transition-colors"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="px-8 h-12 rounded-xl text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Join the Newsletter"}
              </Button>
            </form>

            {/* Footnote */}
            <p className="text-sm text-muted-foreground">
              We send 1 email per month. Unsubscribe anytime.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
