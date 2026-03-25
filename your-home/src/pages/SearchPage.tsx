import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Search as SearchIcon, X, MapPin, Clock, Star } from "lucide-react";
import { PROVIDERS } from "./ServiceDetailPage";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSelectedProvider } = useApp();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('Nearest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [query, activeFilter]);

  const handleBook = (provider: any) => {
    setSelectedProvider(provider);
    navigate('/booking-form');
  };

  // Simulate search filtering
  const results = PROVIDERS.filter(p => 
    p.service.toLowerCase().includes(query.toLowerCase()) || 
    p.name.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => {
    if (activeFilter === 'Top Rated') return b.rating - a.rating;
    if (activeFilter === 'Lowest Price') return a.rate - b.rate;
    if (activeFilter === 'Fastest') return parseInt(a.eta) - parseInt(b.eta);
    return 0; // Nearest (default order for demo)
  });

  return (
    <div className="min-h-screen bg-dark pb-6">
      <div className="sticky top-0 z-30 bg-dark-2 border-b border-dark-3 pt-6 pb-4 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={22} />
            </button>
            <div className="flex-1 bg-[#141210] border border-dark-3 rounded-xl px-4 py-3 flex items-center gap-3 h-[50px]">
              <SearchIcon size={18} className="text-primary" />
              <input 
                type="text"
                autoFocus
                placeholder="Search AC repair, plumber..."
                className="bg-transparent flex-1 text-foreground placeholder:text-muted-foreground focus:outline-none text-[15px]"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLoading(true);
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-muted-foreground">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['Nearest', 'Top Rated', 'Lowest Price', 'Fastest'].map(filter => (
              <button 
                key={filter}
                onClick={() => { setActiveFilter(filter); setLoading(true); }}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-transparent border border-dark-3 text-muted-foreground hover:border-dark-3/80'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {query && (
          <p className="caption-text mb-lg">
            {loading ? 'Searching...' : `${results.length} providers found for "${query}"`}
          </p>
        )}

        <div className="space-y-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : results.length > 0 ? (
            results.map(p => (
              <div key={p.id} className={`bg-dark-2 border border-dark-3 rounded-xl p-4 transition-opacity ${!p.available ? 'opacity-60' : ''}`}>
                <div className="flex gap-4">
                  <div className="w-[60px] h-[60px] rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center font-heading font-bold text-primary text-[20px] shrink-0">
                    {p.initials}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-sm">
                      <h4 className="card-title truncate">{p.name}</h4>
                      <span className="body-semibold text-primary">₹{p.rate}<span className="caption-text text-muted-foreground">/hr</span></span>
                    </div>
                    
                    <p className="card-subtitle mb-md text-primary font-medium">{p.service}</p>
                    
                    <div className="flex flex-wrap gap-sm mb-md">
                      <span className="caption-text"><Star size={12} className="text-primary mr-1 fill-current inline" /> {p.rating} ({p.reviews})</span>
                      <span className="w-1 h-1 rounded-full bg-dark-3 self-center"></span>
                      <span className="flex items-center text-[11px] text-muted-foreground"><MapPin size={12} className="mr-1" /> {p.distance}</span>
                      <span className="w-1 h-1 rounded-full bg-dark-3 self-center"></span>
                      <span className="flex items-center text-[11px] text-muted-foreground"><Clock size={12} className="mr-1" /> {p.eta}</span>
                    </div>
                    
                    <button 
                      onClick={() => p.available && handleBook(p)}
                      disabled={!p.available}
                      className={`w-full py-2.5 rounded-lg font-heading font-bold text-[13px] transition-colors ${
                        p.available 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'bg-dark-3 text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {p.available ? 'Book →' : 'Busy'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              title="No providers found" 
              subtitle={`We couldn't find any pros matching "${query}". Try searching for something else like AC Repair or Plumber.`}
              ctaLabel="Browse all services →"
              onCta={() => navigate('/home')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;