import { type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wind,
  Wrench,
  Zap,
  Paintbrush,
  Sparkles,
  Settings,
  Droplets,
  Shield,
  Sun,
  Hammer,
} from "lucide-react";

type ServiceItem = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  priceRange: string;
  rating: string;
  details: string[];
};

const services: ServiceItem[] = [
  {
    id: "ac-repair",
    icon: Wind,
    title: "AC Repair & Installation",
    description: "Professional AC repair, gas refill, installation, and preventive maintenance for all major brands.",
    priceRange: "Rs400 - Rs2000",
    rating: "4.8 star (2,340 reviews)",
    details: ["30-60 min response time", "Certified technicians", "Warranty included"],
  },
  {
    id: "plumbing",
    icon: Wrench,
    title: "Plumbing Services",
    description: "Leak fixing, pipeline repair, bathroom fittings, and complete plumbing maintenance for homes and offices.",
    priceRange: "Rs250 - Rs1500",
    rating: "4.7 star (1,980 reviews)",
    details: ["Fast emergency support", "Verified local plumbers", "Quality parts only"],
  },
  {
    id: "electrical",
    icon: Zap,
    title: "Electrical Work",
    description: "Wiring repair, switchboard fixes, appliance points, and safe electrical troubleshooting by experts.",
    priceRange: "Rs300 - Rs1800",
    rating: "4.8 star (2,110 reviews)",
    details: ["Safety-first process", "Licensed electricians", "Same-day service"],
  },
  {
    id: "painting-carpentry",
    icon: Paintbrush,
    title: "Painting & Carpentry",
    description: "Wall painting, polish, modular fittings, and custom woodwork with clean finishing.",
    priceRange: "Rs500 - Rs5000",
    rating: "4.6 star (1,420 reviews)",
    details: ["Neat finish guarantee", "Skilled craftsmen", "Material guidance"],
  },
  {
    id: "home-cleaning",
    icon: Sparkles,
    title: "Home Cleaning",
    description: "Deep cleaning for kitchens, bathrooms, sofas, and complete home sanitization packages.",
    priceRange: "Rs600 - Rs3200",
    rating: "4.9 star (3,050 reviews)",
    details: ["Eco-safe products", "Trained staff", "Weekend slots"],
  },
  {
    id: "appliance-repair",
    icon: Settings,
    title: "Appliance Repair",
    description: "Repair support for washing machine, refrigerator, microwave, RO, and small appliances.",
    priceRange: "Rs350 - Rs2200",
    rating: "4.7 star (1,760 reviews)",
    details: ["Original spare support", "On-site diagnosis", "Transparent pricing"],
  },
  {
    id: "water-tank",
    icon: Droplets,
    title: "Water Tank Cleaning",
    description: "Comprehensive water tank cleaning and disinfection service for safe household water storage.",
    priceRange: "Rs700 - Rs2600",
    rating: "4.8 star (980 reviews)",
    details: ["Hygiene certified", "Quick turnaround", "Before/after check"],
  },
  {
    id: "maintenance",
    icon: Hammer,
    title: "General Maintenance",
    description: "Regular upkeep for minor repairs, fittings, and maintenance checks to keep your home reliable.",
    priceRange: "Rs300 - Rs1400",
    rating: "4.6 star (1,230 reviews)",
    details: ["Multi-skill technicians", "Flexible timing", "Monthly plans"],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security Services",
    description: "Home safety checks, lock replacement, CCTV setup support, and secure installation guidance.",
    priceRange: "Rs500 - Rs3000",
    rating: "4.7 star (840 reviews)",
    details: ["Trusted professionals", "Secure installation", "Post-install support"],
  },
  {
    id: "solar",
    icon: Sun,
    title: "Solar Panel Installation",
    description: "Residential solar consultation, setup, and maintenance for efficient and clean energy usage.",
    priceRange: "Rs2500 - Rs18000",
    rating: "4.8 star (620 reviews)",
    details: ["Energy savings plan", "Certified installers", "Service warranty"],
  },
];

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full pt-24 pb-10 px-4 md:px-8" style={{ background: "#0f0f0f" }}>
      <section className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold leading-tight" style={{ color: "#FFFFFF" }}>
            Our Services
          </h1>
          <p className="text-base mt-2" style={{ color: "#B0B0B0" }}>
            Professional services available in your area
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                className="rounded-xl p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333333",
                }}
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(255, 193, 7, 0.12)" }}>
                  <Icon className="w-6 h-6" style={{ color: "#FFC107" }} />
                </div>

                <h2 className="text-[20px] font-semibold mb-2" style={{ color: "#FFFFFF" }}>
                  {service.title}
                </h2>
                <p className="text-sm leading-6 mb-4" style={{ color: "#B0B0B0" }}>
                  {service.description}
                </p>

                <div className="text-base font-bold mb-1" style={{ color: "#FFC107" }}>
                  {service.priceRange}
                </div>
                <div className="text-xs mb-4" style={{ color: "#FFB300" }}>
                  {service.rating}
                </div>

                <ul className="space-y-2 mb-6">
                  {service.details.map((detail) => (
                    <li key={detail} className="text-xs" style={{ color: "#B0B0B0" }}>
                      {detail}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 hover:translate-y-[-2px]"
                  style={{
                    border: "1px solid #FFC107",
                    color: "#FFC107",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFC107";
                    e.currentTarget.style.color = "#1a1a1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#FFC107";
                  }}
                  onClick={() => navigate("/search")}
                >
                  Book Service -&gt;
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
