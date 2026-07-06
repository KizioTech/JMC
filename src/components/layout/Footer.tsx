import { Link } from "react-router-dom";
import { Globe, Mail, Share2 } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-highest dark:bg-tertiary-container w-full mt-stack-lg">
      <div className="py-stack-lg px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <img src="/assets/images/logo.png" alt="JMC Logo" className="h-8 w-auto" />
          <div className="font-headline-h3 text-headline-h3 font-bold text-primary">JMC Academics</div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Empowering mathematical mastery through precision education and expert mentorship since 2024.
        </p>
      </div>
      <div>
        <h4 className="font-label-caps text-label-caps text-primary mb-4">Quick Links</h4>
        <ul className="flex flex-col gap-2">
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/">Home</Link></li>
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/courses">Courses</Link></li>
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/library">Library</Link></li>
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-label-caps text-label-caps text-primary mb-4">Support</h4>
        <ul className="flex flex-col gap-2">
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="#">Help Center</Link></li>
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/privacy">Privacy Policy</Link></li>
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/terms">Terms of Service</Link></li>
          <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="#">Accessibility</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-label-caps text-label-caps text-primary mb-4">Newsletter</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Get the latest tutorial updates.</p>
        <div className="flex gap-2">
          <input className="bg-surface-container border border-outline-variant rounded px-3 py-2 text-body-sm w-full focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Email" type="email" />
          <button className="bg-primary text-on-primary px-4 py-2 rounded font-label-caps text-label-caps hover:bg-primary/90 transition-colors">Join</button>
        </div>
      </div>
      <div className="col-span-1 md:col-span-4 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-body-sm text-body-sm text-on-surface-variant">© {currentYear} JMC Academics. Empowering mathematical mastery.</span>
        <div className="flex gap-4">
          <Globe className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
          <Mail className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
          <Share2 className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;