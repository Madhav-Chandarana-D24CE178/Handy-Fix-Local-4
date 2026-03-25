import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { services } from '@/components/landing/ServicesGrid';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

// Service emoji mapping
const serviceEmojis: Record<string, string> = {
  "AC Repair": "🔧",
  "Plumber": "🚰",
  "Electrician": "⚡",
  "Carpenter": "🔨",
  "Painter": "🎨",
  "Deep Clean": "🧹",
  "Appliance Repair": "🔌",
  "Pest Control": "🦟",
};

const ServiceSelector = () => {
  const { selectedService, setSelectedService } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setOpen(false);
    navigate(`/service/${service.id}`);
  };

  const displayService = selectedService
    ? `${serviceEmojis[selectedService.name] || '•'} ${selectedService.name}`
    : "🔍 Select a service";

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <button className="w-full bg-dark-2 border border-dark-3 rounded-xl px-4 py-3.5 flex items-center justify-between gap-3 transition-all duration-300 hover:border-primary hover:bg-dark-3 active:scale-95 group">
          <div className="flex items-center gap-3 flex-1 text-left">
            <Search size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-foreground text-[15px] font-medium truncate">
              {displayService}
            </span>
          </div>
          <ChevronDown
            size={18}
            className={`text-muted-foreground transition-transform group-hover:text-primary ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      </HoverCardTrigger>

      <HoverCardContent className="w-full p-0 border-dark-3 bg-dark-2" align="start">
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-3">
            Available Services
          </p>

          <div className="grid grid-cols-2 gap-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left group cursor-pointer ${
                  selectedService?.id === service.id
                    ? 'border-primary bg-primary/10'
                    : 'border-dark-3 bg-dark-3/30 hover:border-primary hover:bg-dark-3'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{serviceEmojis[service.name] || '•'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {service.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{service.pros} pros</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ServiceSelector;
