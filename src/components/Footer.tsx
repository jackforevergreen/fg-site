import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Youtube, Instagram, Linkedin, Twitter } from "lucide-react";
import FGLogo from "@/assets/logo.png";
import { useState } from "react";

const footerLinks = {
  company: [
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "mailto:info@forevergreen.earth" }
  ],
  products: [
    { name: "Carbon Credits", href: "/carboncredits" },
    { name: "Methodology", href: "/methodology" },
    { name: "Offset Flights", href: "/flight-offset" },
    { name: "Store", href: "/carboncredits" }
  ],
  policy: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms and Conditions", href: "/terms-and-conditions" },
    { name: "Cookie Policy", href: "/cookie-policy" }
  ],
  social: [
    { name: "YouTube", href: "https://www.youtube.com/@Forevergreenapp", icon: Youtube },
    { name: "Instagram", href: "https://www.instagram.com/forevergreenapp/", icon: Instagram },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/forevergreenapp/", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com/forevergreenapp", icon: Twitter }
  ]
};

const Footer = () => {
  const [cookiePolicyOpen, setCookiePolicyOpen] = useState(false);

  return (
    <footer className="bg-forest text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6 bg-white rounded-md w-fit p-1 pr-3">
              <img
              src={FGLogo}
              alt="Forevergreen"
              className="h-8 md:h-12 w-auto object-contain select-none"
              draggable={false}
            />
                          <span className="text-lg md:text-xl font-bold text-foreground">
              Forever<span className="text-lg md:text-xl font-bold text-foreground" style={{ color: "#217E38" }}>green</span>
            </span>
            </div>
            <p className="text-sage leading-relaxed max-w-md">
              We believe in creating a community where sustainability is accessible for everyone.
              We are building the future of our planet, one tree at a time.
            </p>
            <div className="mt-6">
              <p className="text-sage text-sm">
                <strong>Contact us:</strong><br />
                info@forevergreen.earth
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sage hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sage hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Policy</h3>
            <ul className="space-y-3">
              {footerLinks.policy.map((link, index) => {
                // Special handling for Cookie Policy
                if (link.name === "Cookie Policy") {
                  return (
                    <li key={index}>
                      <button
                        onClick={() => setCookiePolicyOpen(true)}
                        className="text-sage hover:text-white transition-colors duration-200 text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  );
                }
                // Other policy links
                return (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sage hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        <Separator className="bg-sage/30 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sage text-sm">
            © 2026 by Forevergreen Earth INC.
          </p>
          
          <div className="flex items-center gap-6">
            {footerLinks.social.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Cookie Policy Dialog */}
      <Dialog open={cookiePolicyOpen} onOpenChange={setCookiePolicyOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </DialogTitle>
            <DialogDescription className="text-left space-y-4 text-base text-gray-700">
              <p>
                Forevergreen ("we," "us," "our") does not use cookies or similar
                tracking technologies on our website and mobile applications
                (collectively, the "Services"). We prioritize your privacy and aim
                to provide a user experience free from unnecessary data collection.
              </p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. No Use of Cookies
                </h3>
                <p>
                  We do not collect, store, or use cookies on our Services. This
                  means we do not track your browsing activity, store any personal
                  preferences, or use third-party services that deploy cookies.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Contact Us
                </h3>
                <p>
                  If you have any questions or concerns about our no-cookie policy,
                  please contact us at{" "}
                  <a
                    href="mailto:info@forevergreen.earth"
                    className="text-green-600 hover:text-green-700 font-semibold underline"
                  >
                    info@forevergreen.earth
                  </a>
                  .
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;