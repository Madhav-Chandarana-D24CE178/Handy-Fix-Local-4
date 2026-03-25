import { useEffect, useRef } from "react";

const trending = [
  { name: "AC Servicing", rating: "4.9", bookings: "2.4k", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=220&h=280&fit=crop&q=80" },
  { name: "Pipe Leakage", rating: "4.8", bookings: "1.8k", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=220&h=280&fit=crop&q=80" },
  { name: "Switchboard Fix", rating: "4.7", bookings: "1.2k", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=220&h=280&fit=crop&q=80" },
  { name: "Wall Painting", rating: "4.9", bookings: "900", img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=220&h=280&fit=crop&q=80" },
  { name: "Kitchen Cleaning", rating: "4.8", bookings: "3.1k", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=220&h=280&fit=crop&q=80" },
  { name: "Furniture Repair", rating: "4.6", bookings: "700", img: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=220&h=280&fit=crop&q=80" },
];

const TrendingStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    let scrollAmount = 0;
    let raf: number;
    const strip = stripRef.current;
    if (!strip) return;

    const autoScroll = () => {
      if (!hoveredRef.current && strip) {
        scrollAmount += 0.8;
        if (scrollAmount >= strip.scrollWidth - strip.clientWidth) scrollAmount = 0;
        strip.scrollLeft = scrollAmount;
      }
      raf = requestAnimationFrame(autoScroll);
    };

    const timeout = setTimeout(() => { raf = requestAnimationFrame(autoScroll); }, 2000);
    strip.addEventListener("mouseenter", () => { hoveredRef.current = true; });
    strip.addEventListener("mouseleave", () => { hoveredRef.current = false; });

    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, []);

  const scroll = (dir: number) => {
    stripRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-warm-bg overflow-hidden">
      <div className="container">
        <span className="text-primary text-[11px] font-extrabold tracking-[2px] uppercase block mb-3">TRENDING NOW</span>
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading text-3xl lg:text-[34px] font-extrabold">Most booked this week</h2>
          <div className="hidden sm:flex gap-3">
            <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors text-foreground">←</button>
            <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors text-foreground">→</button>
          </div>
        </div>
      </div>
      <div
        ref={stripRef}
        className="flex gap-3.5 overflow-x-auto px-6 pb-10 scrollbar-hide cursor-grab"
      >
        {trending.map((t) => (
          <div key={t.name} className="min-w-[200px] h-[280px] rounded-xl relative overflow-hidden flex-shrink-0 group">
            <img
              src={t.img}
              alt={t.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-5 text-dark-foreground">
              <h4 className="font-heading text-sm font-bold mb-1">{t.name}</h4>
              <div className="flex justify-between text-xs opacity-90">
                <span>⭐ {t.rating}</span>
                <span>{t.bookings} bookings</span>
              </div>
              <button className="mt-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingStrip;
