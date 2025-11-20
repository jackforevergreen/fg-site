import { Separator } from "@/components/ui/separator";
import { Youtube, Instagram, Linkedin, Twitter } from "lucide-react";
import FGLogo from "@/assets/logo.png";

const footerLinks = {
  company: [
    { name: "About", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Contact", href: "mailto:info@forevergreen.earth" }
  ],
  products: [
    { name: "Carbon Credits", href: "#" },
    { name: "Methodology", href: "#" },
    { name: "Offset Flights", href: "#" },
    { name: "Store", href: "#" }
  ],
  social: [
    { name: "YouTube", href: "https://www.youtube.com/@Forevergreenapp", icon: Youtube },
    { name: "Instagram", href: "https://www.instagram.com/forevergreenapp/", icon: Instagram },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/forevergreenapp/", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com/forevergreenapp", icon: Twitter }
  ]
};

const Footer = () => {
  return (
    <footer className="bg-forest text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
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
        </div>
        
        <Separator className="bg-sage/30 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sage text-sm">
            © 2024 by Forevergreen Earth INC.
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
    </footer>
  );
};

export default Footer;