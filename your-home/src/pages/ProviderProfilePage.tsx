import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { PROVIDERS } from "./ServiceDetailPage";
import { ArrowLeft, Star, MapPin, CheckCircle2, Clock, CalendarCheck } from "lucide-react";

const ProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedProvider } = useApp();

  const provider = PROVIDERS.find(p => p.id === Number(id)) || PROVIDERS[0];

  const handleBook = () => {
    setSelectedProvider(provider);
    navigate('/booking-form');
  };

  return (
    <div className="min-h-screen bg-dark pb-[80px]">
      <div className="bg-dark-2 pt-12 pb-6 px-4 rounded-b-3xl border-b border-dark-3 relative shadow-md">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 text-muted-foreground hover:text-foreground p-2"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center text-center mt-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-dark-2 shadow-[0_0_0_2px_hsl(var(--primary))] flex items-center justify-center font-heading font-bold text-primary text-[32px] mb-4">
            {provider.initials}
          </div>
          
          <h1 className="font-heading font-extrabold text-[24px] text-foreground mb-1">{provider.name}</h1>
          <p className="text-[14px] text-muted-foreground mb-3">{provider.service} • {provider.distance} away</p>
          
          <div className="flex gap-2">
            <span className="bg-[hsl(var(--trust-green))]/10 text-trust-green px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 size={14} /> Aadhaar Verified
            </span>
            <span className="bg-[hsl(var(--trust-green))]/10 text-trust-green px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 size={14} /> Background Check
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-dark-2 border border-dark-3 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-1 text-primary"><Star size={20} fill="currentColor" /></div>
            <div className="font-heading font-extrabold text-[20px] text-primary">{provider.rating}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Rating</div>
          </div>
          <div className="bg-dark-2 border border-dark-3 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-1 text-primary"><CalendarCheck size={20} /></div>
            <div className="font-heading font-extrabold text-[20px] text-primary">{provider.totalJobs}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Jobs Done</div>
          </div>
          <div className="bg-dark-2 border border-dark-3 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-1 text-primary"><Clock size={20} /></div>
            <div className="font-heading font-extrabold text-[20px] text-primary">{provider.eta}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Avg Time</div>
          </div>
        </div>

        <div className="bg-dark-2 border border-dark-3 rounded-2xl p-5 mb-8">
          <h3 className="font-heading font-bold text-[18px] text-foreground mb-3">About {provider.name.split(' ')[0]}</h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
            Hi, I am {provider.name}. I have {provider.experience} of experience in {provider.service.toLowerCase()} and home maintenance. I always ensure 100% customer satisfaction and clean up after the job is done.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {['Expert Diagnosis', 'Quick Service', 'Polite', 'Clean Work'].map(skill => (
              <span key={skill} className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-lg text-[12px] font-semibold">
                {skill}
              </span>
            ))}
            <span className="bg-dark-3 text-foreground px-3 py-1 rounded-lg text-[12px] font-semibold">
              {provider.experience} Exp
            </span>
          </div>
          
          <div className="flex justify-between items-center border-t border-dark-3 pt-4 mt-2">
            <span className="text-[13px] text-muted-foreground font-medium">Standard Rate</span>
            <span className="font-heading font-extrabold text-[18px] text-primary">₹{provider.rate}<span className="text-[11px] text-muted-foreground font-body">/hr</span></span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-heading font-bold text-[18px] text-foreground mb-4">Portfolio</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-dark-2 rounded-xl border border-dark-3 overflow-hidden relative">
                <img src={`https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80&auto=format&fit=crop&crop=entropy&t=${i}`} alt="Work sample" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="pb-8">
          <h3 className="font-heading font-bold text-[18px] text-foreground mb-4">Reviews ({provider.reviews})</h3>
          <div className="space-y-4">
            {[
              { name: 'Rohan M.', rating: 5, date: '1 week ago', text: 'Excellent work. Arrived on time and fixed the issue quickly.' },
              { name: 'Sneha P.', rating: 5, date: '2 weeks ago', text: 'Very polite and professional. Highly recommended.' },
              { name: 'Kunal D.', rating: 4, date: '1 month ago', text: 'Good service, but took slightly longer than expected.' }
            ].map((r, i) => (
              <div key={i} className="bg-dark-2 border border-dark-3 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[14px] text-foreground">{r.name}</span>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold">
                    <Star size={10} fill="currentColor" /> {r.rating}.0
                  </div>
                </div>
                <p className="text-[13px] text-muted-foreground mb-2">{r.text}</p>
                <div className="text-[10px] text-muted-foreground font-medium">{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed justify-center bottom-0 left-0 right-0 p-4 bg-dark-2/90 backdrop-blur-md border-t border-dark-3 z-30 w-full">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={handleBook}
            className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            Book {provider.name.split(' ')[0]} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;