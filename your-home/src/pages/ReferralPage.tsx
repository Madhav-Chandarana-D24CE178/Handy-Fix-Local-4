import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Copy, Share2, Facebook, Twitter } from "lucide-react";
import { showSuccess } from "@/components/shared/Toast";
import { useApp } from "@/contexts/AppContext";

const ReferralPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [copied, setCopied] = useState(false);
  
  const referralCode = user?.name ? `${user.name.split(' ')[0].toUpperCase()}50` : 'HANDY50';

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    showSuccess("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Use my code ${referralCode} to get ₹50 off on your first HandyFix booking! 🛠️✨ https://handyfix.app/ref/${referralCode}`;

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HandyFix Referral',
          text: shareText,
          url: `https://handyfix.app/ref/${referralCode}`
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      copyCode();
    }
  };

  return (
    <div className="min-h-screen bg-dark w-full pb-10">
      <div className="bg-dark-2 pt-12 pb-6 px-4 border-b border-dark-3 relative overflow-hidden">
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 text-muted-foreground hover:text-foreground relative z-10">
          <ArrowLeft size={24} />
        </button>
        
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[hsl(var(--trust-green))]/10 rounded-full blur-[40px]"></div>
        
        <div className="flex flex-col items-center text-center mt-2 relative z-10">
          <div className="w-20 h-20 bg-[hsl(var(--trust-green))]/20 rounded-full flex items-center justify-center text-trust-green mb-4">
            <Gift size={36} />
          </div>
          <h1 className="font-heading font-extrabold text-[28px] text-foreground mb-2">
            Invite & Earn ₹100
          </h1>
          <p className="text-[14px] text-muted-foreground max-w-[280px]">
            Give your friends <span className="text-foreground font-bold">₹50 off</span> their first booking, and you get <span className="text-trust-green font-bold">₹100</span> in your wallet when they book!
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-8">
        <div className="bg-dark-2 border border-dark-3 rounded-2xl p-6 mb-8 text-center shadow-lg">
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Your Referral Code</p>
          <div className="flex items-center justify-between border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-4">
            <span className="font-heading font-extrabold text-[24px] text-foreground tracking-widest">{referralCode}</span>
            <button 
              onClick={copyCode}
              className={`p-2.5 rounded-lg transition-colors flex items-center justify-center ${copied ? 'bg-trust-green text-white' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
            >
              <Copy size={20} />
            </button>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-heading font-bold text-[18px] text-foreground mb-4 text-center">Share via</h3>
          <div className="grid grid-cols-4 gap-4 px-2">
            <button 
              onClick={shareNative}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-dark-2 border border-dark-3 rounded-full flex items-center justify-center text-foreground group-hover:scale-110 group-hover:bg-dark-3 transition-all">
                <Share2 size={24} />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">More</span>
            </button>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-[#25D366]/20 border border-[#25D366]/30 rounded-full flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-all">
                WhatsApp
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">WhatsApp</span>
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-full flex items-center justify-center text-[#1DA1F2] group-hover:scale-110 transition-all">
                <Twitter size={24} />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">Twitter</span>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=https://handyfix.app`}
              target="_blank" rel="noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 bg-[#1877F2]/20 border border-[#1877F2]/30 rounded-full flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-all">
                <Facebook size={24} />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">Facebook</span>
            </a>
          </div>
        </div>

        <div className="bg-dark-2 border border-dark-3 rounded-2xl p-5">
          <h3 className="font-heading font-bold text-[16px] text-foreground mb-4">How it works</h3>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-dark-3">
            {[
              { title: "Share your code", desc: "Send your unique code to friends and family." },
              { title: "They get ₹50 off", desc: "Your friends get an instant discount on their first booking." },
              { title: "You get ₹100", desc: "Once their service is completed, ₹100 is credited to your wallet." }
            ].map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-dark border-2 border-primary flex items-center justify-center font-bold text-[12px] text-primary shrink-0 z-10">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-foreground">{step.title}</h4>
                  <p className="text-[13px] text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;