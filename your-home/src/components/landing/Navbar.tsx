import { useEffect, useState } from "react";
import HandyFixLogo from "./HandyFixLogo";
import { useApp } from "@/contexts/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthModal } from "@/components/shared/AuthModal";
import { Bell } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);
  const [userLocal, setUserLocal] = useState<any>(null);
  
  const { isLoggedIn, unreadCount, user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const navLinks = ["Home", "Services", "About", "Contact"];

  useEffect(() => {
    // Check localStorage first
    const token = localStorage.getItem('hf-token');
    const userStr = localStorage.getItem('hf-user');
    setIsLoggedInLocal(!!token);
    if (userStr) setUserLocal(JSON.parse(userStr));
  }, [location]);

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const name = localStorage.getItem('hf-show-welcome');
    if (name && isLanding) {
      localStorage.removeItem('hf-show-welcome');
      setTimeout(() => {
        alert(`Welcome to HandyFix, ${name}! 🎉\n₹50 added to your wallet.`);
      }, 500);
    }
  }, [isLanding]);

  const handleBookService = () => {
    const token = localStorage.getItem('hf-token');
    if (token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-40"
        style={{
          height: '70px',
          position: 'relative',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
          borderBottom: '1px solid #333333',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.28)',
        }}
      >
        <div className="container flex items-center justify-between h-full">
          <button onClick={() => navigate('/')} className="no-underline flex-shrink-0">
            <HandyFixLogo size={36} darkBg={true} />
          </button>

          {/* CENTER TABS - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-0 absolute left-1/2 -translate-x-1/2">
            <a
              href="/home"
              className="px-3 py-2 text-[14px] font-medium transition-colors flex flex-col items-center gap-1"
              style={{
                color: location.pathname === '/home' ? '#FFC107' : '#FFFFFF',
                borderBottom: location.pathname === '/home' ? '2px solid #FFC107' : '2px solid transparent',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span>Home</span>
            </a>
            <a
              href="/my-bookings"
              className="px-3 py-2 text-[14px] font-medium transition-colors flex flex-col items-center gap-1"
              style={{
                color: location.pathname.includes('booking') ? '#FFC107' : '#FFFFFF',
                borderBottom: location.pathname.includes('booking') ? '2px solid #FFC107' : '2px solid transparent',
              }}
              onClick={(e) => {
                if (!localStorage.getItem('hf-token')) {
                  e.preventDefault();
                  navigate('/login');
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Bookings</span>
            </a>
            <a
              href="/emergency"
              className="px-3 py-2 text-[14px] font-medium transition-colors flex flex-col items-center gap-1"
              style={{
                color: location.pathname.includes('emergency') ? '#FFC107' : '#FFFFFF',
                borderBottom: location.pathname.includes('emergency') ? '2px solid #FFC107' : '2px solid transparent',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Emergency</span>
            </a>
            <a
              href="/messages"
              className="px-3 py-2 text-[14px] font-medium transition-colors flex flex-col items-center gap-1"
              style={{
                color: location.pathname.includes('message') ? '#FFC107' : '#FFFFFF',
                borderBottom: location.pathname.includes('message') ? '2px solid #FFC107' : '2px solid transparent',
              }}
              onClick={(e) => {
                if (!localStorage.getItem('hf-token')) {
                  e.preventDefault();
                  navigate('/login');
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span>Messages</span>
            </a>
            <a
              href="/notifications"
              className="px-3 py-2 text-[14px] font-medium transition-colors flex flex-col items-center gap-1"
              style={{
                color: location.pathname.includes('notification') ? '#FFC107' : '#FFFFFF',
                borderBottom: location.pathname.includes('notification') ? '2px solid #FFC107' : '2px solid transparent',
              }}
              onClick={(e) => {
                if (!localStorage.getItem('hf-token')) {
                  e.preventDefault();
                  navigate('/login');
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span>Alerts</span>
            </a>
            <a
              href="/services"
              className="px-3 py-2 text-[14px] font-medium transition-colors flex flex-col items-center gap-1"
              style={{
                color: location.pathname.includes('services') ? '#FFC107' : '#FFFFFF',
                borderBottom: location.pathname.includes('services') ? '2px solid #FFC107' : '2px solid transparent',
              }}
              onClick={(e) => {
                if (!localStorage.getItem('hf-token')) {
                  e.preventDefault();
                  navigate('/login');
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0-1.4 0l-7 7a1 1 0 1 0 1.4 1.4l7-7a1 1 0 0 0 0-1.4z"/>
                <path d="M19 5l-2 2"/>
                <path d="M5 19l2-2"/>
                <path d="M16 3l5 5"/>
                <path d="M3 16l5 5"/>
              </svg>
              <span>Services</span>
            </a>
          </div>

          <div className="hidden lg:flex gap-6 items-center ml-auto">
            {!isLoggedInLocal ? (
              <>
                <button
                  onClick={handleLogin}
                  className={`text-sm font-semibold transition-colors hover:text-primary ${
                    scrolled || !isLanding ? "text-foreground" : "text-card"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={handleBookService}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  Book a Service
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 rounded-lg transition-colors"
                  style={{
                    color: location.pathname.includes('notification') ? '#FFC107' : '#FFFFFF',
                    background: location.pathname.includes('notification') ? 'rgba(255, 193, 7, 0.08)' : 'transparent',
                  }}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-destructive text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-heading font-bold text-base transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)',
                      boxShadow: '0 6px 16px rgba(255, 193, 7, 0.35)',
                    }}
                  >
                    {userLocal?.avatar || user?.avatar || "HE"}
                  </button>
                  
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                      <div className="absolute right-0 top-full mt-3 w-48 bg-dark-2 border border-dark-3 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col py-1 animate-in slide-in-from-top-2">
                        <button onClick={() => { setDropdownOpen(false); navigate('/my-bookings'); }} className="px-4 py-2.5 text-left text-sm hover:bg-dark-3 text-foreground transition-colors">My Bookings</button>
                        <button onClick={() => { setDropdownOpen(false); navigate('/profile'); }} className="px-4 py-2.5 text-left text-sm hover:bg-dark-3 text-foreground transition-colors">Profile</button>
                        <button onClick={() => { setDropdownOpen(false); navigate('/notifications'); }} className="px-4 py-2.5 text-left text-sm hover:bg-dark-3 text-foreground flex justify-between items-center transition-colors">
                          Notifications
                          {unreadCount > 0 && <span className="bg-destructive text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                        </button>
                        <div className="h-px bg-dark-3 my-1"></div>
                        <button 
                          onClick={() => {
                            setDropdownOpen(false);
                            localStorage.removeItem('hf-token');
                            localStorage.removeItem('hf-user');
                            logout();
                            setIsLoggedInLocal(false);
                            setUserLocal(null);
                            navigate('/');
                          }} 
                          className="px-4 py-2.5 text-left text-sm hover:bg-dark-3 text-destructive transition-colors font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block w-6 h-0.5 transition-all bg-foreground`}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-dark-2 border-t border-dark-3 p-6 flex flex-col gap-4 shadow-lg">
            {isLanding && navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-foreground font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </a>
            ))}
            
            {!isLoggedIn && !isLanding && (
              <div className="h-px bg-dark-3 my-2"></div>
            )}

            {/* Mobile 5-tab navigation (when logged in or not on landing) */}
            {!isLanding && (
              <div className="flex flex-col gap-3">
                <a href="/home" onClick={() => setMobileOpen(false)} 
                   className="text-foreground font-medium hover:text-primary transition-colors">
                  Home
                </a>
                <a href="/my-bookings" onClick={() => { setMobileOpen(false); if (!localStorage.getItem('hf-token')) navigate('/login'); }}
                   className="text-foreground font-medium hover:text-primary transition-colors">
                  My Bookings
                </a>
                 <a href="/emergency" onClick={() => setMobileOpen(false)}
                   className="text-foreground font-medium hover:text-primary transition-colors">
                  Emergency
                </a>
                <a href="/messages" onClick={() => { setMobileOpen(false); if (!localStorage.getItem('hf-token')) navigate('/login'); }}
                   className="text-foreground font-medium hover:text-primary transition-colors">
                  Messages
                </a>
                <a href="/notifications" onClick={() => { setMobileOpen(false); if (!localStorage.getItem('hf-token')) navigate('/login'); }}
                   className="text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between">
                  Alerts
                  {unreadCount > 0 && <span className="bg-destructive text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
                </a>
                <a href="/services" onClick={() => { setMobileOpen(false); if (!localStorage.getItem('hf-token')) navigate('/login'); }}
                   className="text-foreground font-medium hover:text-primary transition-colors">
                  Services
                </a>
                {!isLanding && <div className="h-px bg-dark-3"></div>}
              </div>
            )}
            
            {!isLoggedIn ? (
              <>
                <button onClick={() => { setIsAuthOpen(true); setMobileOpen(false); }} className="text-left text-foreground font-semibold">Login</button>
                <button
                  onClick={() => { handleBookService(); setMobileOpen(false); }}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm"
                >
                  Book a Service
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/profile'); setMobileOpen(false); }} className="text-left text-foreground font-semibold">Profile</button>
                <button 
                  onClick={() => {
                    setMobileOpen(false);
                    localStorage.removeItem('hf-token');
                    localStorage.removeItem('hf-user');
                    logout();
                    setIsLoggedInLocal(false);
                    setUserLocal(null);
                    navigate('/');
                  }} 
                  className="text-left text-destructive font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;
