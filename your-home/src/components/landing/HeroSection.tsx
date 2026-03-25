import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface Service {
  id: number;
  name: string;
  emoji: string;
  rate: string;
}

const SERVICES: Service[] = [
  { id: 1, name: "AC Repair", emoji: "❄️", rate: "₹350/hr" },
  { id: 2, name: "Electrician", emoji: "⚡", rate: "₹300/hr" },
  { id: 3, name: "Plumber", emoji: "🚿", rate: "₹400/hr" },
  { id: 4, name: "Carpenter", emoji: "🔨", rate: "₹450/hr" },
  { id: 5, name: "Painting", emoji: "🎨", rate: "₹250/hr" },
  { id: 6, name: "Appliance Repair", emoji: "🔧", rate: "₹275/hr" },
  { id: 7, name: "Deep Cleaning", emoji: "🧹", rate: "₹200/hr" },
  { id: 8, name: "Pest Control", emoji: "🚫🐜", rate: "₹500" },
  { id: 9, name: "Glass Repair", emoji: "🪟", rate: "₹600+" },
  { id: 10, name: "Locksmith", emoji: "🔐", rate: "₹350+" },
  { id: 11, name: "Chimney Cleaning", emoji: "🏠", rate: "₹800+" },
  { id: 12, name: "Store Repair", emoji: "🏪", rate: "₹400/hr" },
  { id: 13, name: "Handyman", emoji: "👷", rate: "₹280/hr" },
  { id: 14, name: "Sofa Cleaning", emoji: "🛋️", rate: "₹350+" },
  { id: 15, name: "Mirror & Glass", emoji: "✨", rate: "₹450+" },
  { id: 16, name: "Water Tank", emoji: "💧", rate: "₹600+" },
];

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setUserLocation, userLocation } = useApp();
  
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const [serviceInput, setServiceInput] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>(SERVICES);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const serviceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll(".reveal");
    els?.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 150);
    });
  }, []);

  // GPS functionality
  const handleGPS = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode using Nominatim
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.address?.city || data.address?.town || data.address?.county || "Your Location";
            setLocationInput(address);
            setUserLocation({
              latitude,
              longitude,
              address: data.display_name,
              city: address,
              isEnabled: true,
            });
            setShowLocationDropdown(false);
          } catch (error) {
            console.error("Geocoding failed:", error);
            setLocationInput("Location found (enable location service)");
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoadingLocation(false);
        }
      );
    }
  };

  // Location autocomplete with debounce
  const handleLocationInput = async (value: string) => {
    setLocationInput(value);
    if (value.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value + ", India")}&limit=6`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Location search failed:", error);
    }
  };

  const selectLocation = (suggestion: LocationSuggestion) => {
    setLocationInput(suggestion.display_name.split(",")[0]);
    setUserLocation({
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name,
      city: suggestion.display_name.split(",")[0],
      isEnabled: true,
    });
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
  };

  // Service filter
  const handleServiceInput = (value: string) => {
    setServiceInput(value);
    if (value.length === 0) {
      setFilteredServices(SERVICES);
    } else {
      setFilteredServices(
        SERVICES.filter((s) =>
          s.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const selectService = (service: Service) => {
    setServiceInput(service.name);
    setShowServiceDropdown(false);
    // Here you can save selected service or navigate
  };

  const displayLocation = userLocation?.city || locationInput || "Your location";

  const handleFindPro = () => {
    if (!serviceInput.trim()) {
      return; // Show toast or error
    }
    // Navigate to search page with service query
    navigate(`/search?q=${encodeURIComponent(serviceInput)}`);
  };

  return (
    <section className="bg-dark min-h-screen flex items-center text-dark-foreground pt-20 pb-16 relative overflow-hidden">
      <div className="container" ref={heroRef}>
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="reveal inline-flex items-center gap-2 bg-dark-2 px-4 py-2 rounded-full text-sm border border-dark-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-trust-green shadow-[0_0_10px_hsl(var(--trust-green))]" />
              1,200+ verified professionals near you
            </div>

            <h1 className="reveal text-4xl sm:text-5xl lg:text-[52px] font-extrabold mb-5 leading-[1.1]">
              Your Home,{" "}
              <span className="text-primary block">Fixed Fast.</span>
              Guaranteed.
            </h1>

            <p className="reveal text-base lg:text-lg text-muted-foreground max-w-lg mb-8">
              Skilled local workers for AC repair, plumbing, electrical, and more — at your door in under 60 minutes.
            </p>

            {/* Search box — dark card */}
            <div className="reveal bg-dark-2 rounded-2xl p-5 mb-8">
              <div className="flex flex-col gap-3">
                {/* Location input with GPS */}
                <div className="relative">
                  <div className="bg-dark-3 flex items-center px-4 py-3.5 gap-3 rounded-xl border border-dark-4 hover:border-dark-3 transition-colors">
                    <span>📍</span>
                    <input
                      ref={locationInputRef}
                      type="text"
                      placeholder="Enter your location or allow GPS"
                      value={locationInput}
                      onChange={(e) => handleLocationInput(e.target.value)}
                      onFocus={() => setShowLocationDropdown(true)}
                      className="flex-1 bg-transparent outline-none text-sm text-dark-foreground font-body placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={handleGPS}
                      disabled={loadingLocation}
                      className="text-primary hover:text-primary/80 transition-colors disabled:opacity-50 text-lg"
                      title="Use current location"
                    >
                      {loadingLocation ? "..." : "📡"}
                    </button>
                  </div>
                  
                  {/* Location suggestions dropdown */}
                  {showLocationDropdown && locationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-2 border border-dark-4 rounded-xl z-50 shadow-lg max-h-64 overflow-y-auto">
                      {locationSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectLocation(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-dark-3 transition-colors border-b border-dark-4 last:border-b-0"
                        >
                          <p className="text-sm font-body text-dark-foreground">
                            {suggestion.display_name.split(",")[0]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.display_name.split(",").slice(1, 3).join(",")}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service dropdown */}
                <div className="relative">
                  <div className="bg-dark-3 flex items-center px-4 py-3.5 gap-3 rounded-xl border border-dark-4 hover:border-dark-3 transition-colors">
                    <span>🔧</span>
                    <input
                      ref={serviceInputRef}
                      type="text"
                      placeholder="What do you need fixed today?"
                      value={serviceInput}
                      onChange={(e) => handleServiceInput(e.target.value)}
                      onFocus={() => setShowServiceDropdown(true)}
                      className="flex-1 bg-transparent outline-none text-sm text-dark-foreground font-body placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Service dropdown menu */}
                  {showServiceDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-2 border border-dark-4 rounded-xl z-50 shadow-lg max-h-72 overflow-y-auto p-2">
                      <div className="grid grid-cols-2 gap-2">
                        {filteredServices.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => selectService(service)}
                            className="text-left p-3 bg-dark-3 hover:bg-primary/10 rounded-lg transition-colors border border-dark-4 hover:border-primary/30 group"
                          >
                            <p className="text-lg mb-1">{service.emoji}</p>
                            <p className="text-xs font-heading font-bold text-dark-foreground group-hover:text-primary">
                              {service.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{service.rate}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={handleFindPro}
                className="w-full h-[54px] mt-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base animate-cta-pulse hover:shadow-lg hover:brightness-90 transition-all">
                Find a Pro Near Me →
              </button>
            </div>

            <div className="reveal flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span>⚡ 60 min avg arrival</span>
              <span>⭐ 4.8 average rating</span>
              <span>✓ No hidden charges</span>
            </div>
          </div>

          {/* Right — Mosaic */}
          <div className="reveal-right relative hidden lg:block">
            <div className="grid grid-cols-2 gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80"
                alt="AC Technician"
                className="rounded-2xl h-[210px] w-full object-cover mt-10 hover:scale-[1.04] transition-transform duration-400"
                loading="lazy"
              />
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                alt="Plumber"
                className="rounded-2xl h-[210px] w-full object-cover hover:scale-[1.04] transition-transform duration-400"
                loading="lazy"
              />
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80"
                alt="Electrician"
                className="rounded-2xl h-[210px] w-full object-cover hover:scale-[1.04] transition-transform duration-400"
                loading="lazy"
              />
              <img
                src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80"
                alt="Carpenter"
                className="rounded-2xl h-[210px] w-full object-cover -mt-10 hover:scale-[1.04] transition-transform duration-400"
                loading="lazy"
              />
            </div>

            {/* Floating card */}
            <div className="absolute bottom-10 -left-10 bg-dark-2 text-dark-foreground p-4 rounded-xl shadow-lg flex items-center gap-3 z-10 w-72 animate-float border-l-[3px] border-trust-green">
              <span className="w-3 h-3 rounded-full bg-trust-green shrink-0" />
              <div>
                <p className="text-sm font-bold font-heading">Ramesh P. — On the way</p>
                <p className="text-xs text-muted-foreground">ETA 8 minutes · ⭐ 4.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-2xl text-muted-foreground animate-bounce-soft">
        ↓
      </div>
    </section>
  );
};

export default HeroSection;
