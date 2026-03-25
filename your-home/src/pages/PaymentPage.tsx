import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, Star } from "lucide-react";
import { showSuccess } from "@/components/shared/Toast";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const navigate = useNavigate();
  const { bookings, updateBooking } = useApp();
  
  const booking = bookings.find(b => b.id === bookingId);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online'|'cash'|'wallet'>('online');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!booking) navigate('/my-bookings');
    else if (booking.paymentStatus === 'paid') setPaymentSuccess(true);
  }, [booking, navigate]);

  if (!booking) return null;

  const handlePay = () => {
    if (paymentMethod === 'online' || paymentMethod === 'wallet') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        updateBooking(booking.id, { paymentStatus: 'paid', paymentMethod });
        setPaymentSuccess(true);
        showSuccess("Payment successful!");
      }, 2000);
    } else {
      showSuccess("Provider notified to collect cash");
      navigate('/my-bookings');
    }
  };

  const isACService = booking.service.toLowerCase().includes('ac');
  const total = booking.amount;
  // Reverse engineering the breakdown for demo purposes
  const labor = isACService ? 280 : total - 99 + (booking.discount || 0);

  return (
    <div className="min-h-screen bg-dark pb-10">
      <div className="bg-dark-2 pt-12 pb-6 px-4 border-b border-dark-3 text-center relative sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={24} />
        </button>
        <span className="flex items-center justify-center gap-2 font-heading font-extrabold text-[20px] text-foreground">
          Complete Payment <ShieldCheck size={20} className="text-trust-green" /> 
        </span>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="bg-dark-2 border border-dark-3 rounded-[24px] p-6 mb-8 shadow-xl relative overflow-hidden">
          {paymentSuccess && <div className="absolute top-0 right-0 w-32 h-32 bg-trust-green/10 rounded-bl-[100px] -z-0"></div>}
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="font-heading font-extrabold text-[22px] text-foreground mb-1">Invoice</h2>
              <p className="text-[13px] text-muted-foreground font-mono">#{booking.id}</p>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              paymentSuccess ? 'bg-trust-green/20 text-trust-green border border-trust-green/30' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
            }`}>
              {paymentSuccess ? 'Paid ✓' : 'Pending'}
            </div>
          </div>

          <div className="bg-dark-3/40 rounded-xl p-4 mb-6 border border-dark-3">
            <h3 className="font-heading font-bold text-[15px] text-foreground">{booking.service}</h3>
            <p className="text-[12px] text-muted-foreground mb-2">by {booking.provider.name}</p>
            <p className="text-[11px] text-muted-foreground flex items-center justify-between">
              <span>{booking.date} • {booking.time}</span>
            </p>
          </div>

          <div className="space-y-4 text-[14px]">
            <div className="flex justify-between text-muted-foreground">
              <span>Visit & Diagnostics</span>
              <span>₹99</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Labor Charges</span>
              <span>₹{labor}</span>
            </div>
            {isACService && !paymentSuccess && (
              <div className="flex justify-between text-muted-foreground">
                <span>Gas Refill & Chemicals</span>
                <span>₹120</span>
              </div>
            )}
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Platform Fee</span>
              <span className="flex items-center gap-2"><span className="line-through text-[11px]">₹50</span><span className="bg-trust-green/20 text-trust-green px-1.5 py-0.5 rounded text-[10px] font-bold">FREE</span></span>
            </div>
            {booking.discount && (
              <div className="flex justify-between text-trust-green font-medium">
                <span>Coupon ({booking.couponApplied})</span>
                <span>-₹{booking.discount}</span>
              </div>
            )}

            <div className="border-t border-dashed border-dark-3 pt-4 flex justify-between items-center relative z-10">
              <span className="font-heading font-extrabold text-[16px] text-foreground uppercase tracking-wider">Total</span>
              <span className={`font-heading font-extrabold text-[28px] ${paymentSuccess ? 'text-trust-green' : 'text-primary'}`}>
                ₹{paymentSuccess ? total : total + (isACService ? 120 : 0)}
              </span>
            </div>
          </div>
        </div>

        {paymentSuccess ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-trust-green/10 border border-trust-green/30 rounded-2xl p-4 flex items-center gap-3 text-trust-green mb-6">
              <CheckCircle2 size={24} />
              <div>
                <h4 className="font-bold text-[15px]">Payment received</h4>
                <p className="text-[12px] opacity-80">Thank you for choosing HandyFix</p>
              </div>
            </div>
            
            <button className="w-full bg-dark-2 border border-dark-3 text-foreground font-bold text-[14px] py-3.5 rounded-xl hover:bg-dark-3 transition-colors flex items-center justify-center gap-2" onClick={() => showSuccess("Receipt downloading...")}>
              <Download size={18} /> Download Receipt
            </button>
            <button onClick={() => navigate('/my-bookings')} className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[15px] py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              View Bookings
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-heading font-bold text-[18px] text-foreground mb-4">Pay with</h3>
            
            <div className="space-y-3 mb-8">
              {[
                { id: 'online', name: 'Pay Online', desc: 'UPI, Credit Card, Netbanking', icon: '💳' },
                { id: 'cash', name: 'Pay Cash', desc: 'Give cash to the professional', icon: '💵' },
                { id: 'wallet', name: 'HandyFix Wallet', desc: 'Secure one-tap payment', icon: '🔄' }
              ].map(method => (
                <label key={method.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-dark-2 border-dark-3 hover:border-dark-3/80'}`}>
                  <div className="flex gap-3">
                    <div className="text-[20px]">{method.icon}</div>
                    <div>
                      <div className="font-bold text-[14px] text-foreground">{method.name}</div>
                      <div className="text-[11px] text-muted-foreground">{method.desc}</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary' : 'border-dark-3'}`}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id as any)} />
                </label>
              ))}
            </div>

            <button 
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                `Pay Securely →`
              )}
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-muted-foreground">
              <ShieldCheck size={14} className="text-trust-green" /> 100% Secure Encrypted Payment
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;