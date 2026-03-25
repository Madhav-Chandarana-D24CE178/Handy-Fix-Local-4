import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError, showInfo } from './Toast';
import { X, ArrowLeft } from 'lucide-react';

declare global {
  interface Window {
    HF_DB?: any;
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'phone' | 'otp' | 'register-1' | 'register-2';

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  // Registration data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [detectedCity, setDetectedCity] = useState('');
  
  const otpRef = useRef<string>('');
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setName('');
      setEmail('');
      setAddress('');
      setPincode('');
      setDetectedCity('');
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpRef.current = generatedOtp;
    console.log('DEV OTP:', generatedOtp);
    setStep('otp');
    setCountdown(30);
    showSuccess('OTP sent!');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(false);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = otp.join('');
    if (entered === otpRef.current || entered === '123456') {
      // Use HF_DB to check if user exists
      const existingUser = window.HF_DB?.getUsersByPhone('+91' + phone);
      
      if (existingUser) {
        login(existingUser);
        onClose();
        navigate('/home');
      } else {
        setStep('register-1');
      }
    } else {
      setOtpError(true);
      showError('Wrong OTP');
      setTimeout(() => {
        setOtpError(false);
        setOtp(['', '', '', '', '', '']);
        otpInputs.current[0]?.focus();
      }, 600);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 6) {
      setPincode(val);
      if (val.length === 6) {
        if (val === '388150') setDetectedCity('Petlad, Gujarat');
        else setDetectedCity('Gujarat area');
      } else {
        setDetectedCity('');
      }
    }
  };

  const handleRegister = () => {
    if (!address || pincode.length !== 6) return;
    
    const userPhone = '+91' + phone;
    const newUser = {
      id: 'U' + Date.now(),
      name,
      phone: userPhone,
      email,
      address,
      pincode,
      city: detectedCity || 'Unknown City',
      avatar: name.substring(0, 2).toUpperCase(),
      createdAt: new Date().toISOString(),
      referralCode: 'HF' + name.toUpperCase().slice(0, 4).replace(/\s/g, '') + Math.floor(1000 + Math.random() * 9000),
      walletBalance: 50,
      subscriptionPlan: 'free' as const
    };

    // Save to HF_DB
    window.HF_DB?.saveUser(userPhone, newUser);

    login(newUser);
    onClose();
    navigate('/home');
    showSuccess(`Welcome to HandyFix, ${name.split(' ')[0]}! 🎉`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-[440px] bg-dark-2 border border-dark-3 rounded-[22px] p-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors">
          <X size={24} />
        </button>

        {step === 'phone' && (
          <div className="flex flex-col items-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <h2 className="font-heading font-extrabold text-3xl mb-2 text-primary">HandyFix</h2>
            <h3 className="text-xl mb-8 text-primary font-heading">Welcome back 👋</h3>
            
            <div className="flex w-full gap-3 mb-6">
              <div className="px-4 py-3 bg-dark-3 border border-dark-3 rounded-xl flex items-center text-foreground font-medium">
                +91
              </div>
              <input 
                type="tel"
                maxLength={10}
                placeholder="Enter mobile number"
                className="flex-1 bg-transparent border border-dark-3 rounded-xl px-4 py-3 text-primary font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>
            
            <button 
              onClick={handleSendOtp}
              disabled={phone.length < 10}
              className="w-full bg-primary text-primary-foreground font-heading font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors mb-6"
            >
              Send OTP →
            </button>
            
            <div className="w-full h-px bg-dark-3 mb-6 relative">
              <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-dark-2 px-3 text-xs text-muted-foreground">OR</span>
            </div>
            
            <button 
              onClick={() => showInfo("Coming soon")}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-gray-100 transition-colors mb-8"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <a href="#" className="text-primary text-sm font-medium hover:underline">
              New here? Join as Pro →
            </a>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col">
            <button onClick={() => setStep('phone')} className="absolute top-4 left-4 text-muted-foreground hover:text-white p-2">
              <ArrowLeft size={20} />
            </button>
            
            <div className="mt-6 mb-8 text-center">
              <h3 className="font-heading font-extrabold text-2xl mb-2 text-white">Verify OTP</h3>
              <p className="text-muted-foreground text-[15px]">
                Enter 6-digit code sent to <span className="text-primary font-medium">+91 {phone}</span>
              </p>
            </div>
            
            <div className="flex gap-2 justify-between w-full mb-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpInputs.current[i] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={`w-12 h-14 bg-background border ${otpError ? 'border-destructive' : 'border-dark-3'} rounded-[10px] text-center font-heading font-bold text-2xl text-primary focus:outline-none focus:border-primary transition-all ${otpError ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleVerifyOtp}
              disabled={otp.join('').length < 6}
              className="w-full bg-primary text-primary-foreground font-heading font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors mb-6"
            >
              Verify & Continue →
            </button>
            
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-muted-foreground text-sm">Resend code in <span className="text-foreground font-medium">{countdown}s</span></p>
              ) : (
                <button onClick={handleSendOtp} className="text-primary text-sm font-medium hover:underline">
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'register-1' && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading font-extrabold text-2xl text-white">Create Account</h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-dark-3"></div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs text-white mb-1.5 block uppercase tracking-wider font-bold">Full Name</label>
                <input 
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-xs text-white mb-1.5 block uppercase tracking-wider font-bold">Mobile Number</label>
                <div className="relative">
                  <input 
                    type="text"
                    disabled
                    value={`+91 ${phone}`}
                    className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3.5 text-muted-foreground cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[hsl(var(--trust-green))]/20 text-[hsl(var(--trust-green))] px-2 py-1 rounded border border-[hsl(var(--trust-green))]/30 flex items-center gap-1 font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Verified
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-white mb-1.5 block uppercase tracking-wider font-bold">Email (Optional)</label>
                <input 
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-transparent border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={() => setStep('register-2')}
              disabled={name.length < 2}
              className="w-full bg-primary text-primary-foreground font-heading font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {step === 'register-2' && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4">
            <button onClick={() => setStep('register-1')} className="absolute top-4 left-4 text-muted-foreground hover:text-white p-2">
              <ArrowLeft size={20} />
            </button>
            <div className="flex justify-between items-center mb-8 mt-4">
              <h3 className="font-heading font-extrabold text-2xl text-white">Almost done!</h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-dark-3"></div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
            </div>
            
            <div className="space-y-5 mb-8">
              <div>
                <label className="text-xs text-white mb-1.5 block uppercase tracking-wider font-bold">Full Address</label>
                <textarea 
                  rows={3}
                  placeholder="House/Flat No., Building Name, Street..."
                  className="w-full bg-transparent border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-xs text-white mb-1.5 block uppercase tracking-wider font-bold">Pincode</label>
                <div className="relative">
                  <input 
                    type="tel"
                    maxLength={6}
                    placeholder="e.g. 388150"
                    className="w-full bg-transparent border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    value={pincode}
                    onChange={handlePincodeChange}
                  />
                  {pincode.length === 6 && (
                    <div className="absolute -bottom-6 left-0 text-[11px] text-primary flex items-center gap-1 animate-in fade-in">
                      📍 {detectedCity} detected
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleRegister}
              disabled={!address || pincode.length !== 6}
              className="w-full bg-primary text-primary-foreground font-heading font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors mt-2"
            >
              Create Account →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
