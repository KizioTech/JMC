"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Puzzle, 
  Layers, 
  Receipt, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronDown,
  BookOpen
} from "lucide-react";

export type MenuItem = { name: string; href: string; icon?: JSX.Element | string };

const Menu = ({ children, items }: { children: React.ReactNode; items: MenuItem[] }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div>
      <button
        className="w-full flex items-center justify-between text-on-surface-variant p-2 rounded-lg hover:bg-surface-container active:bg-surface-container-high duration-150"
        onClick={() => setIsOpened((v) => !v)}
        aria-expanded={isOpened}
        aria-controls="submenu"
      >
        <div className="flex items-center gap-x-2">{children}</div>
        <ChevronDown
          className={`w-4 h-4 duration-150 ${isOpened ? "rotate-180" : ""}`}
        />
      </button>

      {isOpened && (
        <ul id="submenu" className="mx-4 px-2 border-l border-outline-variant text-sm font-medium mt-1 space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.href}
                className="flex items-center gap-x-2 text-on-surface-variant p-2 rounded-lg hover:bg-surface-container active:bg-surface-container-high duration-150"
              >
                {item.icon ? <div className="text-outline">{item.icon}</div> : null}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface SidebarProps {
  user?: {
    email: string;
    name?: string;
    avatarUrl?: string;
    role?: string;
  };
  navigation?: MenuItem[];
  navsFooter?: MenuItem[];
  nestedNav?: MenuItem[];
  onLogout?: () => void;
}

const Sidebar = ({ user, navigation = [], navsFooter = [], nestedNav = [], onLogout }: SidebarProps) => {
  // Navigation arrays are now passed as props

  const profileRef = useRef<HTMLButtonElement | null>(null);
  const [isProfileActive, setIsProfileActive] = useState(false);

  useEffect(() => {
    const handleProfile = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileActive(false);
      }
    };
    document.addEventListener("click", handleProfile);
    return () => document.removeEventListener("click", handleProfile);
  }, []);

  return (
    <nav className="flex flex-col h-screen shrink-0 border-r border-outline-variant bg-surface-container-low sm:w-80 z-40 md:flex overflow-hidden">
      <div className="flex flex-col h-full px-4">
        {/* User Profile Area */}
        <div className="h-20 flex items-center pl-2 pt-4 mb-4">
          <div className="w-full flex items-center gap-x-4">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"}
              className="w-10 h-10 rounded-full object-cover"
              alt="User avatar"
            />
            <div className="overflow-hidden">
              <span className="block text-on-surface text-sm font-semibold truncate">{user?.name || "JMC Student"}</span>
              <span className="block mt-px text-on-surface-variant text-xs truncate capitalize">{user?.role || "Basic Plan"}</span>
            </div>

            <div className="relative flex-1 text-right">
              <button
                ref={profileRef}
                className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container active:bg-surface-container-high transition-colors"
                onClick={() => setIsProfileActive((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isProfileActive}
                aria-controls="profile-menu"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

              {isProfileActive && (
                <div
                  id="profile-menu"
                  role="menu"
                  className="absolute z-50 top-12 right-0 w-64 rounded-lg bg-surface-container-high shadow-lg border border-outline-variant text-sm text-on-surface"
                >
                  <div className="p-2 text-left">
                    <span className="block text-on-surface-variant p-2 truncate">{user?.email || "student@jmc.edu"}</span>
                    <hr className="my-1 border-outline-variant" />
                    
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full gap-2 p-2 text-left text-destructive rounded-md hover:bg-surface-container-highest transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Area */}
        <div className="overflow-auto pb-6">
          <ul className="text-sm font-medium flex-1 space-y-1">
            {navigation.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.href}
                  className="flex items-center gap-x-2 text-on-surface-variant p-2 rounded-lg hover:bg-surface-container hover:text-primary active:bg-surface-container-high duration-150"
                >
                  <div className="text-outline">{item.icon}</div>
                  {item.name}
                </Link>
              </li>
            ))}

            {nestedNav && nestedNav.length > 0 && (
              <li className="pt-2">
                <Menu items={nestedNav}>
                  <div className="text-outline mr-2"><Receipt className="w-5 h-5" /></div>
                  Billing
                </Menu>
              </li>
            )}
          </ul>

          <div className="pt-4 mt-4 border-t border-outline-variant">
            <ul className="text-sm font-medium space-y-1">
              {navsFooter.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-x-2 text-on-surface-variant p-2 rounded-lg hover:bg-surface-container active:bg-surface-container-high duration-150"
                  >
                    <div className="text-outline">{item.icon}</div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Sidebar };
