import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { 
  User, Wallet, MapPin, Search, Grid, Clock, ChevronRight, 
  Settings, HelpCircle, LogOut, ArrowLeft, Star, Heart
} from "lucide-react";
import { showSuccess } from "@/components/shared/Toast";

const ProfilePage = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  if (!user) {
    navigate('/home');
    return null;
  }

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
    navigate('/');
  };

  const sections = [
    {
      title: "My Activity",
      items: [
        { icon: <Clock size={20} />, label: "My Bookings", path: "/my-bookings", badge: "2 Active" },
        { icon: <Heart size={20} />, label: "Saved Pros", path: "/saved" },
        { icon: <Star size={20} />, label: "My Reviews", path: "/reviews" }
      ]
    },
    {
      title: "Account & Payments",
      items: [
        { icon: <Wallet size={20} />, label: "HandyFix Wallet", subtitle: `Balance: ₹${user.walletBalance}`, path: "/wallet" },
        { icon: <MapPin size={20} />, label: "Manage Addresses", subtitle: "2 saved", path: "/addresses" },
        { icon: <Settings size={20} />, label: "App Settings", path: "/settings" }
      ]
    },
    {
      title: "Support",
      items: [
        { icon: <HelpCircle size={20} />, label: "Help & Support", path: "/help" },
        { icon: <Grid size={20} />, label: "About HandyFix", path: "/about" },
        { icon: <Search size={20} />, label: "Terms & Privacy Policy", path: "/terms" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-dark w-full pb-[100px] max-w-lg mx-auto md:max-w-none">
      <div className="md:max-w-xl mx-auto md:pt-10">
        <div className="bg-dark-2 px-4 pt-12 pb-6 border-b border-dark-3 md:rounded-b-3xl relative">
          <button onClick={() => navigate(-1)} style={{ color: '#E4E6EB', padding: '8px 12px', background: '#232118', border: '1px solid #2E2B20', borderRadius: '10px' }} className="absolute top-6 left-4 hover:opacity-80 transition-opacity">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center mt-4">
            <div style={{ background: '#FFC107', color: '#0F1419' }} className="w-24 h-24 rounded-full border-4 border-dark-2 flex flex-col items-center justify-center font-heading font-extrabold text-[32px] mb-4 relative">
              {user.name.split(' ').map(n => n[0]).join('')}
              <button style={{ background: '#232118', borderColor: '#0F1419', color: '#FFC107' }} className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 flex items-center justify-center hover:opacity-80 transition-opacity">
                <Settings size={14} />
              </button>
            </div>
            
            <h1 className="title-1 mb-1">{user.name}</h1>
            <p className="caption-text mb-1">{user.phone}</p>
            <p className="caption-text break-all max-w-[280px] line-clamp-1">{user.email || 'No email added'}</p>
            
            <div className="flex gap-4 mt-6 w-full max-w-[320px]">
              <div style={{ background: '#2E2B20', border: '1px solid #3A3620' }} className="flex-1 rounded-xl p-3 text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/wallet')}>
                <div style={{ color: '#8892A0', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px' }} className="uppercase mb-1">Wallet</div>
                <div style={{ color: '#FFC107', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px' }} className="font-heading">₹{user.walletBalance}</div>
              </div>
              <div style={{ background: '#2E2B20', border: '1px solid #3A3620' }} className="flex-1 rounded-xl p-3 text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/referral')}>
                <div style={{ color: '#8892A0', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px' }} className="uppercase mb-1">Referrals</div>
                <div style={{ color: '#4CAF82', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px' }} className="font-heading">0</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 style={{ color: '#E4E6EB', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px' }} className="font-heading mb-3 px-2">{section.title}</h3>
              <div style={{ background: '#232118', borderColor: '#2E2B20', border: '1px solid #2E2B20' }} className="rounded-2xl overflow-hidden shadow-sm">
                {section.items.map((item, j) => (
                  <div 
                    key={j} 
                    onClick={() => item.path.startsWith('/') ? navigate(item.path) : null}
                    style={{ borderBottomColor: j !== section.items.length - 1 ? '#2E2B20' : 'transparent' }}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-dark-3/50 transition-colors border-b`}
                  >
                    <div className="flex items-center gap-4">
                      <div style={{ color: '#FFC107' }}>{item.icon}</div>
                      <div>
                        <div style={{ color: '#E4E6EB', fontSize: '14px', fontWeight: 600 }} className="font-semibold">{item.label}</div>
                        {item.subtitle && <div style={{ color: '#8892A0', fontSize: '12px' }} className="mt-0.5 font-medium">{item.subtitle}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.badge && <span style={{ background: 'rgba(230,192,74,0.15)', color: '#FFC107', border: '1px solid rgba(230,192,74,0.3)', fontSize: '10px', fontWeight: 700 }} className="uppercase tracking-wider px-2 py-1 rounded">{item.badge}</span>}
                      <ChevronRight size={18} style={{ color: '#5A5440' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={handleLogout}
            className="w-full bg-dark-2 border border-destructive/20 text-destructive font-bold text-[15px] py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
          
          <p style={{ color: '#8892A0', fontSize: '11px' }} className="text-center pb-4">App Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
