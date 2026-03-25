import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, MapPin, Camera, X, CheckCircle2 } from "lucide-react";
import { showSuccess, showError } from "@/components/shared/Toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BookingFormPage = () => {
  const { user, selectedService, selectedProvider, cartData, setCartData, addBooking, addNotification } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Step 1
  const [date, setDate] = useState(cartData.date || new Date().toLocaleDateString('en-IN'));
  const [time, setTime] = useState(cartData.time || '');
  
  // Step 2
  const [address, setAddress] = useState(cartData.address || user?.address || '');
  const [description, setDescription] = useState(cartData.description || '');
  const [photos, setPhotos] = useState<string[]>([]);
  const [contactPhone, setContactPhone] = useState(cartData.contactPhone || user?.phone || '');

  // Step 3
  const [coupon, setCoupon] = useState('');
  const [couponState, setCouponState] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'online'|'cash'|'wallet'>('online');
  
  // Payment Modal
  const [paymentTab, setPaymentTab] = useState('upi');

  useEffect(() => {
    if (!selectedService || !selectedProvider) {
      navigate('/home');
    }
  }, [selectedService, selectedProvider, navigate]);

  if (!selectedService || !selectedProvider || !user) return null;

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      fullDate: d.toLocaleDateString('en-IN')
    };
  });

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  const unavailableSlots = ['11:00 AM', '3:00 PM'];

  const handleNextStep1 = () => {
    if (!date || !time) return showError('Please select date and time');
    setCartData({ ...cartData, date, time });
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!address) return showError('Please provide an address');
    if (!contactPhone) return showError('Please provide a contact number');
    setCartData({ ...cartData, address, description, contactPhone, photos });
    setStep(3);
  };

  const handleApplyCoupon = () => {
    if (!coupon) return;
    setCouponState('loading');
    setTimeout(() => {
      if (coupon.toUpperCase() === 'FIRST50' || coupon === '1234') {
        setCouponState('success');
        setDiscount(50);
      } else {
        setCouponState('error');
        setDiscount(0);
      }
    }, 1000);
  };

  const baseTotal = selectedProvider.rate + 99; // Visit fee + 1 hr labor
  const finalTotal = baseTotal - discount;

  const finalizeBooking = (method: 'online'|'cash'|'wallet', status: 'paid'|'pending') => {
    const newBooking = {
      id: 'HF' + Date.now().toString().slice(-6),
      userId: user.id,
      service: selectedService.name,
      serviceId: selectedService.id,
      provider: selectedProvider,
      date,
      time,
      address,
      description,
      status: 'confirmed' as const,
      amount: finalTotal,
      paymentMethod: method,
      paymentStatus: status,
      createdAt: new Date().toISOString(),
      couponApplied: discount > 0 ? coupon.toUpperCase() : undefined,
      discount
    };
    
    addBooking(newBooking);
    addNotification({
      id: 'n-' + Date.now(),
      type: 'booking',
      title: 'Booking Confirmed ✓',
      message: `Your ${selectedService.name} booking is confirmed for ${date} at ${time}.`,
      time: 'Just now',
      read: false
    });
    
    setShowPayment(false);
    navigate('/booking-success', { state: { bookingId: newBooking.id } });
  };

  const handleConfirmBooking = () => {
    if (paymentMethod === 'online') {
      setShowPayment(true);
    } else if (paymentMethod === 'wallet' && user.walletBalance < finalTotal) {
      showError('Insufficient wallet balance');
    } else {
      finalizeBooking(paymentMethod, paymentMethod === 'cash' ? 'pending' : 'paid');
    }
  };

  const handleOnlinePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess("Payment successful!");
      finalizeBooking('online', 'paid');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-dark pb-[100px]">
      <div className="bg-dark-2 pt-6 pb-4 px-4 sticky top-0 z-30 border-b border-dark-3">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={22} />
          </button>
          
          <div className="flex-1 flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-dark-3 -z-10 -translate-y-[1px]"></div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-[14px] z-10 transition-colors ${
                  step > s 
                    ? 'bg-[hsl(var(--trust-green))] text-white' 
                    : step === s 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-dark-3 text-muted-foreground'
                }`}>
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                <span className={`text-[10px] mt-1 font-bold absolute -bottom-4 ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Schedule' : s === 2 ? 'Details' : 'Confirm'}
                </span>
                
                {s < 3 && (
                  <div className={`absolute top-4 h-[2px] -z-10 transition-colors ${
                    step > s ? 'bg-primary' : 'bg-transparent'
                  }`} style={{ left: s === 1 ? '20px' : 'calc(50% + 20px)', width: 'calc(50% - 40px)' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8">
        {/* Provider Read-only Card */}
        <div className="bg-dark-2 border border-dark-3 rounded-2xl p-4 mb-8 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-primary text-[16px]">
              {selectedProvider.initials}
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-[15px] text-white">{selectedProvider.name}</h4>
              <p className="text-[12px] text-muted-foreground">{selectedService.name} • ⭐ {selectedProvider.rating}</p>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="text-primary text-[12px] font-bold underline">Change</button>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="font-heading font-extrabold text-[22px] mb-6 text-white">Pick a Date & Time</h2>
            
            <div className="mb-8">
              <h3 className="text-[14px] font-bold text-white mb-3">Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((d) => (
                  <button
                    key={d.fullDate}
                    onClick={() => setDate(d.fullDate)}
                    className={`min-w-[64px] h-[72px] flex flex-col items-center justify-center rounded-xl transition-all ${
                      date === d.fullDate 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : d.fullDate === new Date().toLocaleDateString('en-IN')
                          ? 'bg-dark-2 border border-primary text-foreground'
                          : 'bg-dark-2 border border-dark-3 text-muted-foreground hover:border-dark-3/80'
                    }`}
                  >
                    <span className="text-[12px] font-bold mb-1">{d.day}</span>
                    <span className={`font-heading font-extrabold text-[22px] leading-none ${date === d.fullDate ? '' : 'text-foreground'}`}>{d.dateNum}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-[14px] font-bold text-white mb-3">Time Slot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((t) => {
                  const isAvailable = !unavailableSlots.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => isAvailable && setTime(t)}
                      disabled={!isAvailable}
                      className={`py-3.5 rounded-xl font-bold text-[13px] transition-all ${
                        !isAvailable 
                          ? 'bg-dark-2/50 border border-dark-3 text-muted-foreground opacity-40 line-through cursor-not-allowed'
                          : time === t 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'bg-dark-2 border border-dark-3 text-foreground hover:border-dark-3/80'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={handleNextStep1}
              disabled={!date || !time}
              className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next: Add Details →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="font-heading font-extrabold text-[22px] mb-6 text-white">Service Details</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-[14px] font-bold text-white">Service Location</h3>
                  <button onClick={() => setAddress(user.address)} className="text-[11px] text-primary font-bold">Use saved address</button>
                </div>
                <textarea 
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No., Building Name, Street..."
                  className="w-full bg-dark-2 border border-dark-3 rounded-xl px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none mb-3 shadow-sm"
                />
                <button 
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(() => showSuccess("Location detected!"), () => showError("Could not get location"));
                    }
                  }}
                  className="flex items-center gap-2 text-[13px] text-primary font-bold bg-primary/10 px-4 py-2.5 rounded-lg hover:bg-primary/20 transition-colors w-full justify-center border border-primary/20"
                >
                  <MapPin size={16} /> Use current location instead
                </button>
              </div>

              <div className="h-px bg-dark-3 w-full"></div>

              <div>
                <h3 className="text-[14px] font-bold text-white mb-3">Problem Description</h3>
                <div className="relative">
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={300}
                    placeholder="Describe the issue in detail..."
                    className="w-full bg-dark-2 border border-dark-3 rounded-xl px-4 py-3 pb-8 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none shadow-sm"
                  />
                  <div className={`absolute bottom-3 right-4 text-[11px] font-bold ${description.length >= 280 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {description.length}/300
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-foreground mb-3">Add Photos (Optional)</h3>
                <div className="border-2 border-dashed border-dark-3 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-dark-2 hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-dark-3 rounded-full flex items-center justify-center text-muted-foreground mb-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Camera size={20} />
                  </div>
                  <p className="text-[13px] font-bold text-foreground mb-1">Upload images</p>
                  <p className="text-[11px] text-muted-foreground">Max 4 photos, 5MB each</p>
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-foreground mb-3">Contact Number</h3>
                <input 
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 text-[14px] text-foreground focus:outline-none focus:border-primary shadow-sm"
                />
              </div>
            </div>

            <button 
              onClick={handleNextStep2}
              disabled={!address || !contactPhone}
              className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
            >
              Next: Review Order →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="font-heading font-extrabold text-[22px] mb-6 text-white">Review & Pay</h2>

            <div className="bg-dark-2 border border-dark-3 rounded-2xl p-5 mb-6 shadow-md">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-dark-3 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-muted-foreground">{date.split('/')[0]}</span>
                  <span className="text-[14px] font-extrabold text-foreground">{date.split('/')[1]}</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[16px] text-white">{selectedService.name}</h3>
                  <p className="text-[12px] text-muted-foreground">with {selectedProvider.name} • {time}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-[12px] text-muted-foreground mb-4 bg-dark-3/50 p-3 rounded-lg border border-dark-3">
                <MapPin size={14} className="shrink-0 text-primary mt-0.5" />
                <span className="line-clamp-2">{address}</span>
              </div>

              <div className="h-px bg-dark-3 w-full mb-4"></div>

              <div className="space-y-3 text-[13px] mb-4">
                <div className="flex justify-between text-muted-foreground"><span>Visit fee</span><span>₹99</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Labor (est.)</span><span>₹{selectedProvider.rate}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-[hsl(var(--trust-green))] font-medium"><span>Coupon Discount</span><span>-₹{discount}</span></div>
                )}
                <div className="flex justify-between text-muted-foreground items-center">
                  <span>Platform fee</span>
                  <span className="flex items-center gap-2"><span className="line-through text-[11px]">₹50</span><span className="bg-trust-green/20 text-trust-green px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">FREE</span></span>
                </div>
              </div>

              <div className="h-px bg-dark-3 w-full mb-4 border-dashed"></div>

              <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/20">
                <span className="font-extrabold text-[15px] text-foreground">Total Estimate</span>
                <span className="font-heading font-extrabold text-[22px] text-primary">₹{finalTotal}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-[14px] font-bold text-white mb-3">Apply Coupon</h3>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. FIRST50"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className={`flex-1 bg-dark-2 border ${couponState === 'error' ? 'border-destructive' : couponState === 'success' ? 'border-trust-green' : 'border-dark-3'} rounded-xl px-4 py-3 text-[14px] text-foreground uppercase placeholder:normal-case focus:outline-none focus:border-primary shadow-sm`}
                  disabled={couponState === 'success' || couponState === 'loading'}
                />
                {couponState === 'success' ? (
                  <button onClick={() => { setCouponState('idle'); setDiscount(0); setCoupon(''); }} className="bg-dark-3 text-muted-foreground px-4 py-3 rounded-xl font-bold flex items-center justify-center w-[100px] hover:text-foreground">Remove</button>
                ) : (
                  <button 
                    onClick={handleApplyCoupon} 
                    disabled={!coupon || couponState === 'loading'}
                    className="bg-primary/20 text-primary border border-primary/30 px-4 py-3 rounded-xl font-bold flex items-center justify-center w-[100px] disabled:opacity-50 hover:bg-primary/30 transition-colors"
                  >
                    {couponState === 'loading' ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : 'Apply →'}
                  </button>
                )}
              </div>
              {couponState === 'error' && <p className="text-[11px] text-destructive mt-2 font-medium ml-1">Invalid coupon code. Try FIRST50.</p>}
              {couponState === 'success' && <p className="text-[11px] text-trust-green mt-2 font-medium ml-1">Awesome! ₹50 discount applied.</p>}
            </div>

            <div className="mb-8">
              <h3 className="text-[14px] font-bold text-white mb-3">Payment Method</h3>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'online' ? 'bg-primary/10 border-primary shadow-sm' : 'bg-dark-2 border-dark-3 hover:border-dark-3/80'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-3 flex items-center justify-center text-[18px]">💳</div>
                    <div>
                      <div className="font-bold text-[14px] text-foreground flex items-center gap-2">Pay Online <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Recommended</span></div>
                      <div className="text-[11px] text-muted-foreground">UPI, Credit/Debit Card, Netbanking</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary' : 'border-dark-3'}`}>
                    {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'bg-primary/10 border-primary shadow-sm' : 'bg-dark-2 border-dark-3 hover:border-dark-3/80'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-3 flex items-center justify-center text-[18px]">💵</div>
                    <div>
                      <div className="font-bold text-[14px] text-foreground">Pay After Service</div>
                      <div className="text-[11px] text-muted-foreground">Cash or UPI directly to provider</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-primary' : 'border-dark-3'}`}>
                    {paymentMethod === 'cash' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'bg-primary/10 border-primary shadow-sm' : 'bg-dark-2 border-dark-3 hover:border-dark-3/80'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-3 flex items-center justify-center text-[18px]">🔄</div>
                    <div>
                      <div className="font-bold text-[14px] text-foreground">HandyFix Wallet</div>
                      <div className="text-[11px] text-muted-foreground">Balance: ₹{user.walletBalance}</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-primary' : 'border-dark-3'}`}>
                    {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} />
                </label>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center mb-4">By booking, you agree to our Terms of Service & Privacy Policy</p>

            <button 
              onClick={handleConfirmBooking}
              className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Confirm Booking →
            </button>
          </div>
        )}
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="bg-dark-2 border-dark-3 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading font-extrabold text-white text-xl">
              <span className="text-primary">🔒</span> Complete Payment
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center border-b border-dark-3 mb-4">
            <div className="font-heading font-extrabold text-[40px] text-primary leading-none mb-2">₹{finalTotal}</div>
            <div className="text-[13px] text-muted-foreground bg-dark-3 px-3 py-1 rounded-full">{selectedService.name} • {selectedProvider.name}</div>
          </div>

          <div className="flex border-b border-dark-3 mb-6">
            {['upi', 'card', 'netbanking'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setPaymentTab(tab)}
                className={`flex-1 py-3 text-[13px] font-bold uppercase tracking-wider relative ${paymentTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab === 'upi' ? 'UPI' : tab === 'card' ? 'Card' : 'Bank'}
                {paymentTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
              </button>
            ))}
          </div>

          {paymentTab === 'upi' && (
            <div className="space-y-4 animate-in fade-in">
              <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfc)" className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all" />
              <div className="grid grid-cols-4 gap-2">
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                  <button key={app} className="bg-dark-3 border border-dark-3 rounded-xl py-3 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                    <span className="text-[10px] font-bold mt-1 text-foreground">{app}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {paymentTab === 'card' && (
            <div className="space-y-4 animate-in fade-in">
              <input type="text" placeholder="Card Number" maxLength={19} className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-mono" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-mono" />
                <input type="password" placeholder="CVV" maxLength={3} className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-mono" />
              </div>
            </div>
          )}

          {paymentTab === 'netbanking' && (
            <div className="space-y-4 animate-in fade-in">
              <select className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          <button 
            onClick={handleOnlinePayment}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-heading font-extrabold text-[16px] py-4 rounded-xl mt-6 disabled:opacity-70 transition-all flex justify-center items-center"
          >
            {loading ? <div className="w-6 h-6 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> : `Pay ₹${finalTotal}`}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingFormPage;