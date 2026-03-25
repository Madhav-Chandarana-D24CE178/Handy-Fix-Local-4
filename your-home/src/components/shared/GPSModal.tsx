import React, { useState, useEffect } from 'react';
import { showSuccess } from './Toast';

const GPSModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    // Check if on landing page and not shown in session
    if (window.location.pathname === '/home' && !sessionStorage.getItem('hf-gps-shown')) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hf-gps-shown', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sessionStorage.setItem('hf-location', JSON.stringify({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }));
          showSuccess("Location detected!");
          setIsOpen(false);
        },
        () => {
          setShowManual(true);
        }
      );
    } else {
      setShowManual(true);
    }
  };

  const handleManualSubmit = () => {
    if (pincode.length === 6) {
      sessionStorage.setItem('hf-location-pincode', pincode);
      showSuccess(`Location set for ${pincode}`);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 transition-all duration-300">
      <div className="absolute inset-0 max-sm:bg-transparent" onClick={() => setIsOpen(false)} />
      
      <div className="w-full sm:max-w-sm bg-dark-2 sm:rounded-[20px] rounded-t-[20px] sm:overflow-hidden relative pb-8 sm:pb-0 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        <div className="flex justify-center pt-3 pb-2 sm:hidden relative z-10" onClick={(e) => e.stopPropagation()}>
          <div className="w-8 h-1 bg-dark-3 rounded-full"></div>
        </div>
        
        <div className="px-5 pt-2 pb-6 sm:p-6" onClick={(e) => e.stopPropagation()}>
          {!showManual ? (
            <div className="flex flex-col text-center items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="font-heading font-bold text-[18px] text-foreground mb-1">Enable location for better results</h3>
              <p className="text-[13px] text-muted-foreground mb-6">We'll show pros closest to you</p>
              
              <button 
                onClick={handleAllowLocation}
                className="w-full bg-primary text-primary-foreground font-heading font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors mb-3"
              >
                Allow Location
              </button>
              
              <button 
                onClick={() => setShowManual(true)}
                className="w-full bg-transparent border border-dark-3 text-foreground font-semibold py-3 rounded-xl hover:bg-dark-3 transition-colors"
              >
                Enter manually
              </button>
            </div>
          ) : (
            <div className="flex flex-col animate-in fade-in slide-in-from-right-4">
              <h3 className="font-heading font-bold text-[18px] text-foreground mb-1">Enter your Pincode</h3>
              <p className="text-[13px] text-muted-foreground mb-5">To see services available in your area</p>
              
              <input
                type="tel"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 388150"
                className="w-full bg-transparent border border-dark-3 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all mb-4"
                autoFocus
              />
              
              <button 
                onClick={handleManualSubmit}
                disabled={pincode.length !== 6}
                className="w-full bg-primary text-primary-foreground font-heading font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPSModal;
