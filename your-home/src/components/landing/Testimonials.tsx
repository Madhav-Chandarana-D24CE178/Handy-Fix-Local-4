const testimonials = [
  {
    name: "Priya Sharma",
    city: "Ahmedabad",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "My AC was dead in peak summer. HandyFix sent a pro in 40 minutes. Fixed it the same day. Absolutely love this app!",
  },
  {
    name: "Rahul Mehta",
    city: "Surat",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "Needed emergency plumbing at midnight. The pro arrived in 55 mins. Price was exactly what was quoted. No drama.",
  },
  {
    name: "Sunita Patel",
    city: "Vadodara",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    quote: "Carpenter was professional, tools were neat, work was perfect. Way better than calling random people from Google.",
  },
];

const Testimonials = () => (
  <section className="py-24 bg-card">
    <div className="container">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl lg:text-[34px] font-extrabold">What our customers say</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={t.name} className="reveal bg-dark text-dark-foreground p-8 rounded-2xl" style={{ transitionDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-3 mb-5">
              <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
              <div>
                <h4 className="font-heading text-base font-bold">{t.name} · {t.city}</h4>
              </div>
            </div>
            <p className="text-primary mb-3">★★★★★</p>
            <p className="italic text-[15px] opacity-90">"{t.quote}"</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
