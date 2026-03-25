import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { services } from "@/components/landing/ServicesGrid";
import { showSuccess } from "@/components/shared/Toast";
import GPSModal from "@/components/shared/GPSModal";
import LocationSearchWithSuggestions from "@/components/shared/LocationSearchWithSuggestions";
import ServiceSelector from "@/components/shared/ServiceSelector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const HomePage = () => {
  const { user, bookings, setSelectedService, addBooking, addNotification } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sosOpen, setSosOpen] = useState(false);
  const [gpsModalOpen, setGpsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show GPS modal on first visit
    const gpsPromptShown = localStorage.getItem('gps-prompt-shown');
    if (!gpsPromptShown && user) {
      setTimeout(() => setGpsModalOpen(true), 500);
    }
  }, [user]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    navigate(`/service/${service.id}`);
  };

  const handleSOSConfirm = () => {
    const emergencyBooking = {
      id: 'HF' + Date.now().toString().slice(-6),
      userId: user?.id || 'demo',
      service: 'Emergency Response',
      serviceId: 99,
      provider: {
        id: 99, name: 'Emergency Driver', initials: 'ED', service: 'Emergency',
        experience: '10 yrs', rating: 5.0, reviews: 100, distance: 'Nearby',
        eta: '5 min', rate: 700, available: true, phone: '+91 00000 00000', totalJobs: 500
      },
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      address: user?.address || 'Current Location',
      description: 'Emergency assistance requested',
      status: 'active' as const,
      amount: 700,
      paymentMethod: 'cash' as const,
      paymentStatus: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    
    addBooking(emergencyBooking);
    addNotification({
      id: 'n-' + Date.now(),
      type: 'system',
      title: 'SOS Dispatched',
      message: 'Emergency provider is on the way.',
      time: 'Just now',
      read: false,
      action: '/tracking',
      actionLabel: 'Track Now'
    });
    showSuccess("Emergency pro dispatched!");
    setSosOpen(false);
    navigate('/tracking');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark w-full pt-20 px-4 pb-20 md:pb-8 max-w-lg mx-auto md:max-w-none relative">
      <div className="md:max-w-4xl mx-auto">
        {/* GPS Permission Modal */}
        <GPSModal open={gpsModalOpen} onOpenChange={setGpsModalOpen} />

        {/* Greeting Section */}
        <div className="card-container mb-lg flex justify-between items-start">
          <div>
            <h1 className="heading-greeting">
              Good morning, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="subheading-greeting">What do you need fixed today?</p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 rounded-full px-3 py-1.5 max-w-[120px]">
            <span className="text-primary text-[10px]">📍</span>
            <span className="text-primary text-[11px] font-semibold truncate">{user.city || 'Home'}</span>
          </div>
        </div>

        {/* Location Search Bar */}
        <div className="mb-6">
          <LocationSearchWithSuggestions />
        </div>

        {/* Original Search Bar */}
        <div className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 flex items-center gap-3 mb-5 transition-colors focus-within:border-primary">
          <Search size={20} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search AC repair, plumber..."
            className="bg-transparent flex-1 text-foreground placeholder:text-muted-foreground text-[15px] focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Promo Banners */}
        <div className="flex overflow-x-auto gap-3 pb-2 mb-8 -mx-4 px-4 scrollbar-hide snap-x">
          <div className="min-w-[260px] md:min-w-[320px] snap-center bg-primary rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <h3 className="font-heading font-extrabold text-[16px] text-primary-foreground mb-1">🎉 First service FREE</h3>
              <p className="text-[12px] text-primary-foreground/80 mb-4 font-medium">Use code FIRST50</p>
              <button 
                onClick={() => navigate('/search')}
                className="bg-[#1C1A14] text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-black transition-colors"
              >
                Claim →
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 bg-white/20 w-24 h-24 rounded-full blur-xl"></div>
          </div>
          
          <div className="min-w-[260px] md:min-w-[320px] snap-center bg-dark-2 border border-primary/20 rounded-xl p-4 flex flex-col justify-between flex-shrink-0 shadow-md">
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-primary mb-1">⭐ Refer & Earn ₹100</h3>
              <p className="text-[12px] text-muted-foreground mb-4 font-medium">Invite friends, earn credits</p>
              <button 
                onClick={() => navigate('/referral')}
                className="border border-primary text-primary text-[11px] font-bold px-4 py-1.5 rounded-lg hover:bg-primary/10 transition-colors inline-block"
              >
                Share →
              </button>
            </div>
          </div>
          
          <div className="min-w-[260px] md:min-w-[320px] snap-center bg-[#0D2818] border border-trust-green/20 rounded-xl p-4 flex flex-col justify-between flex-shrink-0 shadow-md">
            <div>
              <h3 className="font-heading font-extrabold text-[16px] text-trust-green mb-1">🛡️ All pros verified</h3>
              <p className="text-[12px] text-trust-green/70 mb-4 font-medium">Aadhaar + background checked</p>
              <button className="border border-trust-green text-trust-green text-[11px] font-bold px-4 py-1.5 rounded-lg hover:bg-trust-green/10 transition-colors inline-block">
                Learn →
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-4xl">
          <span className="section-label">OUR SERVICES</span>
          <h2 className="section-title">What do you need?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {loading ? (
              Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              services.map((s, i) => (
                <div
                  key={s.name}
                  onClick={() => handleServiceClick(s)}
                  className="bg-dark-2 rounded-xl overflow-hidden border border-dark-3 hover:border-primary hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="h-28 overflow-hidden relative">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-2/90 to-transparent"></div>
                  </div>
                  <div className="p-md -mt-8 relative z-10 flex flex-col h-full">
                    <h3 className="card-title group-hover:text-primary transition-colors">{s.name}</h3>
                    <p className="card-subtitle">{s.pros} pros near you</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {bookings.length > 0 ? (
          <div>
            <span className="section-label">RECENT ACTIVITY</span>
            <div className="flex overflow-x-auto gap-lg pb-4 -mx-4 px-4 scrollbar-hide">
              {bookings.slice(0, 3).map(b => (
                <div key={b.id} className="min-w-[280px] bg-dark-2 border border-dark-3 rounded-xl p-lg flex flex-col justify-between shadow-sm flex-shrink-0">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-10 h-10 bg-dark-3 rounded-lg flex items-center justify-center text-lg">🔧</div>
                      <div>
                        <h4 className="card-title">{b.service}</h4>
                        <p className="card-subtitle">{b.date}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      b.status === 'active' ? 'bg-primary/20 text-primary border border-primary/30' : 
                      b.status === 'completed' ? 'bg-[hsl(var(--trust-green))]/20 text-[hsl(var(--trust-green))] border border-[hsl(var(--trust-green))]/30' : 
                      'bg-dark-3 text-muted-foreground'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {b.status === 'active' ? (
                    <button onClick={() => navigate('/tracking')} className="w-full bg-primary/10 text-primary font-bold text-[12px] py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                      Track Live <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button onClick={() => {
                        const s = services.find(x => x.name === b.service) || services[0];
                        setSelectedService(s);
                        navigate(`/service/${s.id}`);
                      }} 
                      className="w-full bg-dark-3 text-foreground font-medium text-[12px] py-2 rounded-lg hover:bg-dark-3/80 transition-colors flex items-center justify-center gap-2"
                    >
                      Rebook
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState 
            title="Your bookings will appear here" 
            subtitle="Book a service and track its progress right here on your home screen."
          />
        )}
      </div>

      {/* SOS Button */}
      <button
        onClick={() => setSosOpen(true)}
        className="fixed bottom-[80px] md:bottom-8 right-4 md:right-8 z-40 w-14 h-14 bg-destructive text-white rounded-full flex flex-col items-center justify-center shadow-lg animate-sos-pulse hover:bg-red-600 transition-colors"
      >
        <span className="font-extrabold text-[15px] leading-none mb-0.5 font-heading">SOS</span>
      </button>

      {/* SOS Dialog */}
      <AlertDialog open={sosOpen} onOpenChange={setSosOpen}>
        <AlertDialogContent className="bg-dark-2 border border-destructive/30 max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-heading font-extrabold text-xl flex items-center gap-2">
              <span className="bg-destructive/20 text-destructive w-8 h-8 rounded-full flex items-center justify-center text-sm">🚨</span>
              Emergency Service Request
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground text-[14px] leading-relaxed pt-2 space-y-3">
              <p>Nearest available pro will be dispatched immediately.</p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive font-semibold">
                ⚠️ Surge pricing: 2x applies
              </div>
              <p className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin size={16} className="text-primary" /> Your location: <span className="text-foreground font-medium">{user.city || 'Home'}</span>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-col gap-2 sm:flex-col sm:space-x-0">
            <AlertDialogAction 
              onClick={handleSOSConfirm}
              className="w-full bg-destructive text-white hover:bg-red-600 font-bold py-3 text-[15px] h-auto"
            >
              Confirm Emergency →
            </AlertDialogAction>
            <AlertDialogCancel className="w-full bg-transparent border-dark-3 hover:bg-dark-3 hover:text-foreground text-muted-foreground">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HomePage;
