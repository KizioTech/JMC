import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { socialLinks } from "@/components/ui/social-icons";

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
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">
            Empowering mathematical mastery through precision education and expert mentorship since 2024.
          </p>
          {/* Social icons */}
          <div className="flex flex-wrap gap-2">
            {socialLinks.map(({ name, href, Icon, color }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className={`flex items-center justify-center w-8 h-8 rounded-full border border-outline-variant bg-surface-container text-on-surface-variant transition-all duration-200 hover:border-primary/40 hover:bg-surface-container-high ${color}`}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-label-caps text-label-caps text-primary mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-2">
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/">Home</Link></li>
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:underline" to="/about">About</Link></li>
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
          <span className="font-body-sm text-body-sm text-on-surface-variant">© {currentYear} JMC Academics · Josophat Makawa Chifundo · Zomba, Malawi</span>
          <div className="flex items-center gap-3">
            <a href="mailto:info.jmcacademics@gmail.com" aria-label="Email" className="text-on-surface-variant hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            {socialLinks.map(({ name, href, Icon, color }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className={`text-on-surface-variant transition-colors ${color}`}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;