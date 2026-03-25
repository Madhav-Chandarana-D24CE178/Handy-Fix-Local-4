import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { services } from "@/components/landing/ServicesGrid";
import { ArrowLeft, Star, MapPin, Clock, ShieldCheck, ChevronRight } from "lucide-react";

export const PROVIDERS = [
  { id: 1, name: 'Ramesh Patel', initials: 'RP', service: 'AC Technician', experience: '7 yrs', rating: 4.9, reviews: 284, distance: '1.2 km', eta: '45 min', rate: 350, available: true, phone: '+91 98765 43210', totalJobs: 284 },
  { id: 2, name: 'Sunil Mehta', initials: 'SM', service: 'AC Technician', experience: '4 yrs', rating: 4.6, reviews: 156, distance: '2.8 km', eta: '60 min', rate: 300, available: true, phone: '+91 87654 32109', totalJobs: 156 },
  { id: 3, name: 'Kiran Shah', initials: 'KS', service: 'AC Technician', experience: '9 yrs', rating: 4.8, reviews: 312, distance: '3.1 km', eta: '55 min', rate: 400, available: false, phone: '+91 76543 21098', totalJobs: 312 },
  { id: 4, name: 'Vijay Bhai', initials: 'VB', service: 'AC & Appliance', experience: '5 yrs', rating: 4.5, reviews: 198, distance: '4.2 km', eta: '70 min', rate: 320, available: true, phone: '+91 54321 09876', totalJobs: 198 }
];

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedService, setSelectedService, setSelectedProvider } = useApp();
  
  const [activeFilter, setActiveFilter] = useState('All');
  
  const service = selectedService || services.find(s => s.id === Number(id));

  useEffect(() => {
    if (!service && id) {
      const found = services.find(s => s.id === Number(id));
      if (found) setSelectedService(found);
      else navigate('/home');
    }
  }, [id, service, navigate, setSelectedService]);

  if (!service) return null;

  const handleBook = (provider: any) => {
    setSelectedProvider(provider);
    navigate('/booking-form');
  };

  const filteredProviders = PROVIDERS.filter(p => {
    if (activeFilter === 'Top Rated') return p.rating >= 4.8;
    if (activeFilter === 'Fastest') return parseInt(p.eta) <= 50;
    return true;
  });

  return (
    <div className="min-h-screen bg-dark pb-[80px]">
      {/* Header Image */}
      <div className="relative w-full h-56 rounded-b-[20px] overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 z-20 w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <img src={service.img} alt={service.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
        <div className="absolute bottom-6 left-5 z-10 w-full">
          <h1 className="font-heading font-extrabold text-3xl text-white mb-2">{service.name}</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-primary font-bold text-sm bg-primary/10 px-2 py-1 rounded backdrop-blur-sm">
              <Star size={14} fill="currentColor" /> 4.8 (12k+ jobs)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto -mt-4">
        {/* Info Card */}
        <div className="bg-dark-2 rounded-2xl p-5 mx-4 relative z-10 shadow-lg border border-dark-3 mb-6">
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
            Professional {service.name.toLowerCase()} experts at your doorstep. Background verified, trained, and equipped with the right tools.
          </p>
          
          <div className="bg-[#141210] rounded-xl p-4 border border-dark-3 mb-4">
            <h4 className="font-heading font-bold text-sm mb-3 text-foreground">Estimate Breakdown</h4>
            <div className="space-y-2 text-[13px] text-muted-foreground">
              <div className="flex justify-between"><span>Visit fee</span><span>₹99</span></div>
              <div className="flex justify-between"><span>Labor</span><span>₹200 - ₹400</span></div>
              <div className="flex justify-between"><span>Parts</span><span>₹0 - ₹500</span></div>
              <div className="flex justify-between text-trust-green"><span>Platform fee</span><span>FREE</span></div>
              <div className="h-px w-full bg-dark-3 my-2"></div>
              <div className="flex justify-between font-bold text-[15px] text-primary"><span>Total</span><span>₹299 - ₹999</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {['Expert techs', '30-day warranty', 'Genuine parts', 'Transparent pricing'].map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-[12px] font-medium text-foreground">
                <ShieldCheck size={16} className="text-trust-green" /> {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Providers List */}
        <div className="px-4 mb-8">
          <h3 className="font-heading font-bold text-[18px] mb-4 text-foreground">Available Pros Near You</h3>
          
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {['All', 'Top Rated', 'Nearest', 'Fastest'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-dark-2 border border-dark-3 text-muted-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredProviders.map(p => (
              <div key={p.id} className={`bg-dark-2 border border-dark-3 rounded-xl p-4 flex items-center gap-4 transition-opacity ${!p.available ? 'opacity-60 grayscale-[30%]' : 'hover:border-primary/50 cursor-pointer'}`}
                onClick={() => p.available && handleBook(p)}
              >
                <div className="w-[52px] h-[52px] shrink-0 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center font-heading font-bold text-primary text-[18px]">
                  {p.initials}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-heading font-bold text-[15px] truncate text-foreground">{p.name}</h4>
                    <span className="font-heading font-extrabold text-[15px] text-primary shrink-0">₹{p.rate}<span className="text-[10px] text-muted-foreground font-body">/hr</span></span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-primary">{p.service}</span>
                    <span className="w-1 h-1 rounded-full bg-dark-3"></span>
                    <span className="text-[11px] flex items-center text-muted-foreground"><Star size={10} className="text-primary mr-0.5 fill-current" /> {p.rating} ({p.reviews})</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-dark-3 text-muted-foreground px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1"><MapPin size={10} /> {p.distance}</span>
                    <span className="bg-dark-3 text-muted-foreground px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1"><Clock size={10} /> {p.eta}</span>
                    <span className="bg-[hsl(var(--trust-green))]/10 text-trust-green px-2 py-0.5 rounded text-[10px] font-bold">✓ Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="px-4 pb-10">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-heading font-bold text-[18px] text-foreground">Customer Reviews</h3>
            <button className="text-primary text-[12px] font-bold flex items-center">See all <ChevronRight size={14} /></button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Amit Desai', date: '2 days ago', rating: 5, text: 'Very professional. Fixed the AC in 30 mins.' },
              { name: 'Priya Sharma', date: '1 week ago', rating: 4, text: 'Good service but came 15 mins late.' },
            ].map((r, i) => (
              <div key={i} className="border-b border-dark-3 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-[13px] text-foreground">{r.name}</span>
                  <span className="text-[11px] text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array(5).fill(0).map((_, idx) => (
                    <Star key={idx} size={12} fill={idx < r.rating ? 'hsl(var(--primary))' : 'transparent'} className={idx < r.rating ? 'text-primary' : 'text-muted-foreground'} />
                  ))}
                </div>
                <p className="text-[13px] text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed justify-center bottom-0 left-0 right-0 p-4 bg-dark-2/90 backdrop-blur-md border-t border-dark-3 z-30 w-full">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Starting from</span>
            <span className="font-heading font-extrabold text-[20px] text-primary">{service.price}</span>
          </div>
          <button 
            onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
            }}
            className="bg-primary text-primary-foreground font-heading font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            Select Pro <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;