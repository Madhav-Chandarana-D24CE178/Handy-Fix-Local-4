import { useState } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

const GPSLocationButton = () => {
  const { setUserLocation } = useApp();
  const [loading, setLoading] = useState(false);
  const [locationObtained, setLocationObtained] = useState(false);

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      const address = data.address?.road ? `${data.address.road}, ${data.address.city || data.address.town || data.address.village}` : 'Address not found';
      const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
      
      return { address, city };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { 
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: 'Current Location'
      };
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { address, city } = await getAddressFromCoordinates(latitude, longitude);

          const locationData = {
            latitude,
            longitude,
            address,
            city,
            isEnabled: true
          };

          setUserLocation(locationData);
          setLocationObtained(true);
          toast.success(`Location found: ${city}`);
        } catch (error) {
          console.error('Error processing location:', error);
          toast.error('Failed to process location');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable in settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('Failed to get location');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <button
      onClick={handleGetLocation}
      disabled={loading || locationObtained}
      className={`w-full flex gap-2 items-center justify-center px-4 py-3 rounded-xl font-heading font-bold transition-all duration-300 ${
        locationObtained
          ? 'bg-trust-green/20 border border-trust-green text-trust-green cursor-default'
          : loading
          ? 'bg-primary/50 border border-primary text-primary-foreground'
          : 'bg-primary border border-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
      }`}
    >
      {loading ? (
        <>
          <Loader size={18} className="animate-spin" />
          <span>Getting location...</span>
        </>
      ) : locationObtained ? (
        <>
          <MapPin size={18} />
          <span>✓ Location enabled</span>
        </>
      ) : (
        <>
          <MapPin size={18} />
          <span>📍 Turn on GPS</span>
        </>
      )}
    </button>
  );
};

export default GPSLocationButton;
