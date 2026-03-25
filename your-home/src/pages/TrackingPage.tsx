import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { ProgressStepper } from "@/components/shared/ProgressStepper";
import { showSuccess, showInfo, showError } from "@/components/shared/Toast";
import { ArrowLeft, Phone, MessageSquare, ShieldAlert, Send, X } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const TrackingPage = () => {
  const { bookings, updateBooking } = useApp();
  const navigate = useNavigate();
  const activeBooking = bookings.find(b => b.status === 'active');
  
  const [eta, setEta] = useState(12);
  const [currentStep, setCurrentStep] = useState<'active' | 'arrived'>('active');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { text: "On my way, will reach in ~10 minutes", sender: "provider", time: "10:15 AM" },
    { text: "Okay, I'm home. 2nd floor flat 12B", sender: "user", time: "10:16 AM" }
  ]);
  
  const mapRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (!activeBooking) return;
    
    // Initialize leaflet map
    if (!mapRef.current) {
      const map = L.map('tracking-map', { zoomControl: false }).setView([22.5645, 72.9289], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: ''
      }).addTo(map);
      
      const userIcon = L.divIcon({
        html: '<div style="width:16px;height:16px;background:hsl(var(--primary));border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>',
        iconSize: [16,16], className: ''
      });
      L.marker([22.5645, 72.9289], { icon: userIcon }).addTo(map).bindPopup('Your location');
      
      const providerIcon = L.divIcon({
        html: '<div style="width:20px;height:20px;background:hsl(var(--destructive));border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(0,0,0,0.5);animation:pulse 1.5s infinite"></div>',
        iconSize: [20,20], className: ''
      });
      
      const waypoints: [number, number][] = [
        [22.5720, 72.9180], [22.5710, 72.9200], [22.5700, 72.9220],
        [22.5690, 72.9240], [22.5680, 72.9255], [22.5670, 72.9265],
        [22.5660, 72.9275], [22.5655, 72.9280], [22.5648, 72.9286], [22.5645, 72.9289]
      ];
      
      const providerMarker = L.marker(waypoints[0], { icon: providerIcon }).addTo(map).bindPopup(activeBooking.provider.name);
      
      L.polyline(waypoints, { 
        color:'hsl(var(--primary))', dashArray:'8 8', opacity:0.6, weight:3 
      }).addTo(map);

      mapRef.current = map;
      
      let step = 0;
      const interval = setInterval(() => {
        if (step < waypoints.length) {
          providerMarker.setLatLng(waypoints[step]);
          step++;
          setEta(Math.max(0, 12 - step));
        } else {
          clearInterval(interval);
          setCurrentStep('arrived');
          showSuccess('Provider has arrived! 🏠');
        }
      }, 3000); // 3 seconds per step for demo purposes
      
      return () => {
        clearInterval(interval);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [activeBooking]);

  if (!activeBooking) {
    return (
      <div className="min-h-screen bg-dark w-full flex flex-col pt-20 px-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground w-max mb-4 inline-block">
          <ArrowLeft size={24} />
        </button>
        <EmptyState 
          title="No active tracking" 
          subtitle="You don't have any bookings currently in progress."
          ctaLabel="View My Bookings"
          onCta={() => navigate('/my-bookings')}
        />
      </div>
    );
  }

  const handleCancelClick = () => {
    if (eta <= 5) {
      showError("Cannot cancel: Provider is almost there (< 5 mins)");
    } else {
      setCancelOpen(true);
    }
  };

  const cancelConfirm = () => {
    updateBooking(activeBooking.id, { status: 'cancelled' });
    navigate('/my-bookings');
    showSuccess("Booking cancelled.");
  };

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    setMsgs([...msgs, { text: chatMsg, sender: 'user', time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) }]);
    setChatMsg("");
  };

  return (
    <div className="h-screen bg-dark w-full flex flex-col overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-4 bg-dark-2/90 backdrop-blur-md px-4 h-14 shadow-sm border-b border-dark-3">
        <button onClick={() => navigate('/my-bookings')} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={22} />
        </button>
        <span className="font-heading font-extrabold text-[16px] text-foreground flex-1">Tracking Your Pro</span>
        <div className="flex items-center gap-1.5 bg-primary/20 px-2 py-1 rounded border border-primary/30">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Live</span>
        </div>
      </div>

      <div id="tracking-map" className="w-full h-[55vh] z-0"></div>

      <div className="absolute bottom-0 left-0 right-0 h-[45vh] bg-dark-2 rounded-t-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20 flex flex-col border border-dark-3 border-b-0">
        <div className="flex justify-center p-3 shrink-0"><div className="w-10 h-1 bg-dark-3 rounded-full"></div></div>
        
        <div className="px-4 pb-2 shrink-0 border-b border-dark-3">
          <div className="flex justify-between items-center mb-0">
            <div className="flex gap-4 items-center">
              <div className="w-[52px] h-[52px] rounded-full bg-primary/20 flex flex-col items-center justify-center font-heading font-bold text-primary text-[18px]">
                {activeBooking.provider.initials}
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-[18px] text-foreground">{activeBooking.provider.name}</h3>
                <p className="text-[12px] text-muted-foreground">{activeBooking.service} • ⭐ {activeBooking.provider.rating}</p>
              </div>
            </div>
            {eta === 0 && <span className="text-trust-green font-bold text-[14px]">Arrived! ✓</span>}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full scrollbar-hide">
          <div className="p-5 w-full max-w-lg mx-auto">
            {eta > 0 && (
              <div className="bg-primary rounded-2xl p-4 text-center mb-5 relative overflow-hidden shadow-lg shadow-primary/20">
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-heading font-extrabold text-primary-foreground leading-none" style={{ fontSize: '56px' }}>{eta}</span>
                  <span className="text-[14px] font-bold text-primary-foreground/80 mt-1 uppercase tracking-wider">minutes away</span>
                </div>
                <div className="absolute -right-4 -bottom-4 bg-white/20 w-24 h-24 rounded-full blur-xl"></div>
                <div className="absolute -left-4 -top-4 bg-white/20 w-16 h-16 rounded-full blur-xl"></div>
              </div>
            )}
            
            <div className="mb-6 bg-dark-3/30 rounded-xl p-2 border border-dark-3">
              <ProgressStepper currentStep={currentStep} />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => showInfo(`Calling ${activeBooking.provider.name}...`)}
                className="bg-transparent border-2 border-primary text-primary font-bold text-[14px] py-3.5 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={18} /> Call Pro
              </button>
              <button 
                onClick={() => setChatOpen(true)}
                className="bg-primary text-primary-foreground font-bold text-[14px] py-3.5 rounded-xl border-2 border-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <MessageSquare size={18} fill="currentColor" className="text-primary-foreground/80" /> Message
              </button>
            </div>
            
            <div className="flex justify-center pb-2">
              <button 
                onClick={handleCancelClick}
                className="text-destructive font-bold text-[13px] hover:underline flex items-center gap-1.5 bg-destructive/10 px-4 py-2 rounded-lg"
              >
                <ShieldAlert size={14} /> Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="p-0 bg-dark-2 border-dark-3 sm:max-w-md w-full h-[500px] flex flex-col fixed bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[24px] rounded-t-[24px] rounded-b-none  !outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
          <div className="flex-1 flex flex-col min-h-0 bg-dark-2 rounded-t-[24px] sm:rounded-[24px] overflow-hidden">
            <div className="bg-dark-3 p-4 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-primary text-[14px]">
                    {activeBooking.provider.initials}
                  </div>
                  <div className="w-3 h-3 bg-trust-green border-2 border-dark-3 rounded-full absolute bottom-0 right-0"></div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[15px] text-foreground leading-tight">{activeBooking.provider.name}</h3>
                  <p className="text-[11px] text-trust-green font-medium">Online</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground bg-dark-2 p-1.5 rounded-full"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark">
              {msgs.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-[18px] px-4 py-2.5 max-w-[75%] shadow-sm ${
                    m.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'bg-dark-3 text-foreground rounded-bl-none'
                  }`}>
                    <p className="text-[13px] leading-relaxed">{m.text}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-dark-2 border-t border-dark-3 shrink-0">
              <div className="flex items-center gap-2 bg-dark-3 rounded-full p-1 pl-4 border border-dark-3 focus-within:border-primary/50 transition-colors">
                <input 
                  type="text" 
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-[14px] text-foreground focus:outline-none placeholder:text-muted-foreground"
                />
                <button onClick={sendMsg} disabled={!chatMsg.trim()} className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 shrink-0 shadow-md">
                  <Send size={16} className="-ml-0.5 mt-0.5" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="bg-dark-2 border-dark-3 max-w-[320px] rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-extrabold text-foreground text-center text-[20px]">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-[14px] text-center">
              The professional is already on their way. Canceling now will notify them to turn back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0 mt-4">
            <AlertDialogAction onClick={cancelConfirm} className="w-full bg-destructive text-white hover:bg-destructive/90 font-bold py-3 text-[14px] h-auto rounded-xl shadow-lg shadow-destructive/20">
              Yes, Cancel booking
            </AlertDialogAction>
            <AlertDialogCancel className="w-full bg-dark-3 border-dark-3 hover:bg-dark-3/80 hover:text-foreground text-foreground font-bold py-3 h-auto rounded-xl">
              No, Keep waiting
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TrackingPage;