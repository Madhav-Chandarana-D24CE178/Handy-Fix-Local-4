import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, AlertTriangle, ShieldCheck } from "lucide-react";

const PriceEstimatorPage = () => {
  const navigate = useNavigate();

  const [serviceCategory, setServiceCategory] = useState("");
  const [issueType, setIssueType] = useState("");
  const [urgency, setUrgency] = useState("");

  const [estimate, setEstimate] = useState<{min: number, max: number, hours: number} | null>(null);

  const calculateEstimate = () => {
    let min = 99; // Base visit
    let max = 99;
    let hours = 1;

    switch(serviceCategory) {
      case 'ac':
        min += 300; max += 1500; hours = 2;
        break;
      case 'plumbing':
        min += 150; max += 800; hours = 1.5;
        break;
      case 'electrical':
        min += 150; max += 1200; hours = 1;
        break;
      case 'cleaning':
        min += 1000; max += 4000; hours = 4;
        break;
      default:
        min += 200; max += 500; hours = 1;
    }

    if (urgency === 'high') {
      min *= 1.5; max *= 1.5;
    }

    setEstimate({ min: Math.round(min), max: Math.round(max), hours });
  };

  return (
    <div className="min-h-screen bg-dark w-full">
      <div className="bg-dark-2 pt-12 pb-6 px-4 border-b border-dark-3 sticky top-0 z-30 shadow-sm relative">
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-extrabold text-[24px] text-foreground text-center flex items-center justify-center gap-2">
          Pricing Estimator <Calculator size={22} className="text-primary" />
        </h1>
        <p className="text-[13px] text-muted-foreground text-center mt-2 max-w-[280px] mx-auto">Get an instant, approximate quote before booking your service.</p>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div>
          <label className="block text-[14px] font-bold text-foreground mb-3">Service Category</label>
          <select 
            value={serviceCategory}
            onChange={(e) => { setServiceCategory(e.target.value); setEstimate(null); }}
            className="w-full bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-[14px] text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="">Select a category</option>
            <option value="ac">AC & Appliance Repair</option>
            <option value="plumbing">Plumbing Services</option>
            <option value="electrical">Electrical Work</option>
            <option value="cleaning">Deep Cleaning</option>
          </select>
        </div>

        {serviceCategory && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-[14px] font-bold text-foreground mb-3">Type of Issue/Task</label>
            <select 
              value={issueType}
              onChange={(e) => { setIssueType(e.target.value); setEstimate(null); }}
              className="w-full bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-[14px] text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="">Select issue details</option>
              <option value="minor">Minor Install / Fix (e.g. leaking tap)</option>
              <option value="major">Major Repair / Breakdown</option>
              <option value="maintenance">Routine Maintenance / Servicing</option>
            </select>
          </div>
        )}

        {issueType && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-[14px] font-bold text-foreground mb-3">Urgency</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all text-center ${urgency === 'normal' ? 'bg-primary/10 border-primary' : 'bg-dark-2 border-dark-3 hover:border-dark-3/80'}`}>
                <input type="radio" name="urgency" className="hidden" checked={urgency === 'normal'} onChange={() => { setUrgency('normal'); setEstimate(null); }} />
                <span className="font-bold text-[14px] mb-1 text-foreground">Normal</span>
                <span className="text-[11px] text-muted-foreground">Within 24-48 hrs</span>
              </label>
              
              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all text-center ${urgency === 'high' ? 'bg-destructive/10 border-destructive' : 'bg-dark-2 border-dark-3 hover:border-dark-3/80'}`}>
                <input type="radio" name="urgency" className="hidden" checked={urgency === 'high'} onChange={() => { setUrgency('high'); setEstimate(null); }} />
                <span className="font-bold text-[14px] mb-1 text-foreground">Emergency SOS</span>
                <span className="text-[11px] text-muted-foreground">Under 1 hour</span>
              </label>
            </div>
          </div>
        )}

        <button 
          onClick={calculateEstimate}
          disabled={!serviceCategory || !issueType || !urgency}
          className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Calculate Estimate
        </button>

        {estimate && (
          <div className="mt-8 animate-in zoom-in duration-300">
            <div className="bg-dark-2 border border-dark-3 rounded-2xl p-6 relative overflow-hidden text-center shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[80px]"></div>
              
              <h3 className="font-heading font-bold text-[16px] text-foreground mb-1 mt-2">Estimated Cost Range</h3>
              <p className="font-heading font-extrabold text-[36px] text-primary mb-4 leading-none">
                ₹{estimate.min} - ₹{estimate.max}
              </p>
              
              <div className="flex justify-center flex-wrap gap-2 mb-6">
                <span className="bg-dark-3 text-muted-foreground px-3 py-1 text-[12px] font-bold rounded-full flex items-center gap-1">⏱️ Est. Time: ~{estimate.hours} hrs</span>
                {urgency === 'high' && <span className="bg-destructive/10 text-destructive px-3 py-1 text-[12px] font-bold rounded-full">Price Surge: 1.5x</span>}
              </div>
              
              <div className="bg-dark-3/50 rounded-xl p-4 text-left border border-dark-3 space-y-2 mb-4">
                <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Visit Fee</span><span className="font-bold">₹99</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-muted-foreground">Spare Parts</span><span className="font-bold text-muted-foreground">Not included</span></div>
              </div>
              
              <div className="flex items-start gap-2 text-[11px] text-muted-foreground text-left bg-dark-3 p-3 rounded-lg">
                <AlertTriangle size={14} className="shrink-0 text-amber-500 mt-0.5" />
                <span>This is an approximate estimate. Final price may vary based on exact problem diagnosis and actual parts required by the professional.</span>
              </div>
            </div>
            
            <button onClick={() => navigate('/home')} className="w-full mt-4 bg-transparent border-2 border-primary text-primary font-bold text-[15px] py-3.5 rounded-xl hover:bg-primary/10 transition-colors">
              Find Professionals Now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceEstimatorPage;