import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { showSuccess, showError } from './Toast';

interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export const LocationSearchWithSuggestions = () => {
  const { setUserLocation, userLocation } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>(userLocation?.city || '');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle GPS location fetch
  const handleGPSClick = async () => {
    if (!navigator.geolocation) {
      showError('Geolocation not supported in your browser');
      return;
    }

    setGpsLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: { 'User-Agent': 'HandyFix-App' }
              }
            );
            const data = await response.json();
            
            const city = data.address?.city || 
                        data.address?.town || 
                        data.address?.village || 
                        'Current Location';
            const address = data.display_name || 'Unknown Address';
            
            setUserLocation({
              latitude,
              longitude,
              address,
              city,
              isEnabled: true
            });
            
            setSelectedLocation(city);
            setSearchInput(city);
            setShowSuggestions(false);
            showSuccess(`📍 Location set to ${city}`);
          } catch (err) {
            console.error('Reverse geocoding failed:', err);
            setUserLocation({
              latitude,
              longitude,
              address: `${latitude}, ${longitude}`,
              city: 'Current Location',
              isEnabled: true
            });
            setSelectedLocation('Current Location');
            showSuccess('📍 GPS location fetched!');
          }
        },
        (error) => {
          setGpsLoading(false);
          if (error.code === error.PERMISSION_DENIED) {
            showError('Please enable GPS in your device settings');
          } else if (error.code === error.TIMEOUT) {
            showError('Location request timed out');
          } else {
            showError('Unable to retrieve location');
          }
        },
        { timeout: 10000 }
      );
      setGpsLoading(false);
    } catch (err) {
      setGpsLoading(false);
      showError('Error fetching GPS location');
    }
  };

  // Debounced search for locations
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchInput.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchInput
          )}&format=json&addressdetails=1&limit=5`,
          {
            headers: { 'User-Agent': 'HandyFix-App' }
          }
        );
        
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Search error:', err);
        setIsLoading(false);
        showError('Unable to fetch location suggestions');
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchInput]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const city = suggestion.address?.city || 
                 suggestion.address?.state || 
                 suggestion.display_name.split(',')[0];
    
    setUserLocation({
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name,
      city: city,
      isEnabled: true
    });

    setSelectedLocation(city);
    setSearchInput(city);
    setShowSuggestions(false);
    showSuccess(`📍 Location set to ${city}`);
  };

  // Handle clear selection
  const handleClear = () => {
    setSearchInput('');
    setSelectedLocation('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2 items-center bg-dark-2 border border-dark-3 rounded-xl px-4 py-3 focus-within:border-primary transition-all">
        <MapPin size={18} className="text-primary shrink-0" />
        
        <input
          type="text"
          placeholder="Enter location or state name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => searchInput && setShowSuggestions(true)}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-[15px]"
        />

        {searchInput && (
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {isLoading ? (
          <Loader size={18} className="text-primary animate-spin" />
        ) : (
          <button
            onClick={handleGPSClick}
            disabled={gpsLoading}
            className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-[12px] font-bold uppercase disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {gpsLoading ? '🔄 Getting...' : '📍 GPS'}
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-dark-2 border border-dark-3 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
        >
          <div className="max-h-[300px] overflow-y-auto">
            {suggestions.map((suggestion) => {
              const city = suggestion.address?.city || 
                          suggestion.address?.state || 
                          suggestion.display_name.split(',')[0];
              const state = suggestion.address?.state || '';
              
              return (
                <button
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-dark-3 transition-colors border-b border-dark-3 last:border-b-0"
                >
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-foreground text-[14px] truncate">
                        {city}
                      </div>
                      <div className="text-[12px] text-muted-foreground truncate">
                        {state && state !== city ? `${state}, ` : ''}
                        {suggestion.address?.country}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No results message */}
      {showSuggestions && searchInput && suggestions.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-2 border border-dark-3 rounded-xl shadow-lg z-50 p-4 text-center">
          <p className="text-muted-foreground text-sm">No locations found</p>
          <p className="text-muted-foreground text-xs mt-1">Try searching for a city or state name</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearchWithSuggestions;
