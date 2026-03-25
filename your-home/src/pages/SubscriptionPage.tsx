import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Crown, Zap, ShieldCheck } from "lucide-react";
import { showSuccess } from "@/components/shared/Toast";
import { useApp } from "@/contexts/AppContext";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const handleSubscribe = () => {
    showSuccess("HandyFix Pro subscription unlocked! 🎉");
    navigate('/home');
  };

  const benefits = [
    "Zero visit fees on all bookings",
    "15% off on spare parts & hardware",
    "Priority booking (Under 1 hour ETA)",
    "Free 1 AC Servicing per year",
    "100% money-back guarantee on service",
    "Dedicated premium customer support"
  ];

  return (
    <div className="min-h-screen bg-dark w-full pb-10">
      <div className="bg-dark-2 pt-12 pb-8 px-4 border-b border-dark-3 sticky top-0 z-30 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/20 rounded-full blur-[80px]"></div>
        
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 text-muted-foreground hover:text-foreground relative z-10">
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center justify-center text-center mt-4 relative z-10">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Crown size={32} />
          </div>
          <h1 className="font-heading font-extrabold text-[28px] text-foreground mb-2 flex items-center gap-2">
            HandyFix <span className="text-primary">PRO</span>
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-[280px]">
            The ultimate home maintenance membership for smart homeowners.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-8">
        <div className="bg-dark-2/50 border border-dark-3 rounded-full p-1 flex mb-8 relative z-10">
          <button 
            onClick={() => setBilling('monthly')}
            className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all ${billing === 'monthly' ? 'bg-dark-3 text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBilling('yearly')}
            className={`flex-1 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center justify-center gap-1 ${billing === 'yearly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Yearly <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Save 40%</span>
          </button>
        </div>

        <div className="bg-dark-2 border border-primary/30 rounded-3xl p-6 relative overflow-hidden shadow-[0_10px_40px_rgba(245,158,11,0.1)] mb-8">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="text-center mb-6">
            <h2 className="font-heading font-extrabold text-[40px] text-foreground leading-none mb-1">
              ₹{billing === 'yearly' ? '1,499' : '199'}
            </h2>
            <p className="text-[13px] text-muted-foreground">/{billing === 'yearly' ? 'year' : 'month'}, cancel anytime.</p>
          </div>

          <div className="space-y-4 mb-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-trust-green shrink-0 mt-0.5" />
                <span className="text-[13px] text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleSubscribe}
            className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Zap size={18} fill="currentColor" /> Upgrade to PRO Now
          </button>
          <p className="text-center text-[10px] text-muted-foreground mt-4">
            By upgrading, you agree to our Subscription Terms.
          </p>
        </div>

        <div className="bg-dark-2 border border-dark-3 rounded-2xl p-5 flex items-start gap-4">
          <ShieldCheck size={28} className="text-primary shrink-0" />
          <div>
            <h4 className="font-bold text-[14px] text-foreground mb-1">Secure & Transparent</h4>
            <p className="text-[12px] text-muted-foreground">Your payment is encrypted. We don't store your card details on our servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;