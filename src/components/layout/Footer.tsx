import { Link } from "react-router-dom";
import { Facebook, Youtube, Instagram, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/contact" },
    { name: "Courses", path: "/courses" },
    { name: "Resources", path: "/library" },
    { name: "Contact", path: "/contact" },
  ];

  const subjects = [
    "Algebra",
    "Geometry",
    "Calculus",
    "Statistics",
    "Trigonometry",
    "Pre-Calculus",
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://web.facebook.com/profile.php?id=61576781334567", label: "Facebook" },
    { icon: Youtube, href: "https://www.youtube.com/@jmcmath", label: "YouTube" },
    { icon: Instagram, href: "https://www.instagram.com/kiziojosh/", label: "Instagram" },
    { icon: MessageCircle, href: "https://wa.me/2659999788278", label: "WhatsApp" },
  ];

  return (
    <footer className="bg-hero-dark text-primary-foreground relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">JMC Mathematics</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Delivering clean, structured, and effective learning materials designed for both self-learners
              and schools. No fluff — just real math, made simple.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-xl font-bold mb-4">Subjects</h3>
            <ul className="space-y-2">
              {subjects.map((subject) => (
                <li key={subject}>
                  <Link
                    to="/library"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {subject}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest math resources and tips.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-hero-mid border-hero-light text-primary-foreground placeholder:text-muted-foreground"
              />
              <Button type="submit" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-hero-light mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} JMC Mathematics. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;