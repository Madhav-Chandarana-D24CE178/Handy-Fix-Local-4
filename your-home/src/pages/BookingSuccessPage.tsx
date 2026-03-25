import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Copy, MapPin, Calendar, Clock, CreditCard } from "lucide-react";
import { showSuccess } from "@/components/shared/Toast";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings } = useApp();
  const [countdown, setCountdown] = useState(15);
  
  const bookingId = location.state?.bookingId;
  const booking = bookings.find(b => b.id === bookingId);

  useEffect(() => {
    if (!booking) {
      navigate('/home');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/my-bookings');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-dark w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-500 delay-100">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-trust-green/20 rounded-full animate-ping opacity-20"></div>
          <svg className="w-full h-full text-trust-green drop-shadow-[0_0_15px_rgba(76,175,130,0.5)]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="283" strokeDashoffset="283" className="animate-[draw-check_0.8s_ease-out_forwards]" />
            <path d="M30 50 L45 65 L70 35" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="100" className="animate-[draw-check_0.5s_ease-out_0.6s_forwards]" />
          </svg>
        </div>

        <h1 className="font-heading font-extrabold text-[32px] text-foreground mb-2">Booking Confirmed! 🎉</h1>
        
        <div className="flex items-center justify-center gap-2 mb-8 bg-dark-2 border border-dark-3 inline-flex px-4 py-2 rounded-full cursor-pointer hover:bg-dark-3 transition-colors"
          onClick={() => {
            navigator.clipboard.writeText(booking.id);
            showSuccess("ID copied!");
          }}
        >
          <span className="text-muted-foreground text-[14px]">ID {booking.id}</span>
          <Copy size={14} className="text-primary" />
        </div>

        <div className="bg-dark-2 border border-dark-3 rounded-[24px] p-6 text-left mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-3">
            <div className="w-[56px] h-[56px] rounded-2xl bg-primary/20 flex flex-col items-center justify-center font-heading font-bold text-primary text-[18px]">
              {booking.provider.initials}
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-[18px] text-foreground">{booking.service}</h3>
              <p className="text-[13px] text-primary font-medium">{booking.provider.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-muted-foreground">
              <Calendar size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] uppercase font-bold tracking-wider mb-0.5">Date</p>
                <p className="text-[15px] text-foreground font-medium">{booking.date}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-muted-foreground">
              <Clock size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] uppercase font-bold tracking-wider mb-0.5">Time</p>
                <p className="text-[15px] text-foreground font-medium">{booking.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] uppercase font-bold tracking-wider mb-0.5">Location</p>
                <p className="text-[14px] text-foreground font-medium line-clamp-2">{booking.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-muted-foreground">
              <CreditCard size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] uppercase font-bold tracking-wider mb-0.5">Payment</p>
                <div className="flex items-center gap-2">
                  <p className="font-heading font-extrabold text-[16px] text-primary">₹{booking.amount}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${booking.paymentStatus === 'paid' ? 'bg-trust-green/20 text-trust-green border border-trust-green/30' : 'bg-dark-3 text-muted-foreground'}`}>
                    {booking.paymentStatus === 'paid' ? `PAID VIA ${booking.paymentMethod}` : `PAY VIA ${booking.paymentMethod}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/tracking')}
            className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Track Your Pro →
          </button>
          
          <button 
            onClick={() => navigate('/my-bookings')}
            className="w-full bg-transparent border-2 border-dark-3 text-foreground font-heading font-bold text-[15px] py-3.5 rounded-xl hover:bg-dark-3 transition-colors"
          >
            View My Bookings
          </button>
          
          <button 
            onClick={() => navigate('/home')}
            className="w-full bg-transparent text-primary text-[14px] font-bold py-3 hover:underline"
          >
            Book Another Service
          </button>
        </div>

        <p className="text-[13px] text-muted-foreground mt-8 bg-dark-3 inline-block px-4 py-1.5 rounded-full">
          Auto-redirect in <span className="text-foreground font-bold">{countdown}s</span>
        </p>
      </div>
    </div>
  );
};

export default BookingSuccessPage;