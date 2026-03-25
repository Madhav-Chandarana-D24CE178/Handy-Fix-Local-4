import { MapPin, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const LocationSearchBar = () => {
  const { userLocation, user, clearUserLocation } = useApp();

  const displayLocation = userLocation?.city || user?.city || 'Set location';

  return (
    <div className="w-full bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 flex items-center justify-between gap-3 transition-all duration-300">
      <div className="flex items-center gap-3 flex-1">
        <MapPin size={20} className="text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Location</p>
          <p className="text-foreground text-[15px] font-medium truncate">
            {displayLocation}
          </p>
        </div>
      </div>
      
      {userLocation?.isEnabled && (
        <button
          onClick={clearUserLocation}
          className="p-1.5 hover:bg-dark-3 rounded-lg transition-colors flex-shrink-0"
          title="Clear location"
        >
          <X size={18} className="text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};

export default LocationSearchBar;
