const ForUsers = () => (
  <section className="py-24 bg-card">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="reveal-left relative">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
            alt="Happy Customer"
            className="rounded-xl w-full h-[500px] object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-6 right-0 lg:-right-5 bg-card text-foreground p-4 rounded-xl shadow-lg z-10 animate-float max-w-[260px]">
            <p className="text-primary text-sm mb-1">⭐⭐⭐⭐⭐</p>
            <p className="text-sm font-medium">"Ramesh fixed our AC in 45 mins!"</p>
            <p className="text-xs text-muted-foreground mt-1">— Priya S., Ahmedabad</p>
          </div>
        </div>

        <div className="reveal-right">
          <span className="text-primary font-extrabold text-xs uppercase tracking-wider block mb-4">FOR HOMEOWNERS</span>
          <h2 className="font-heading text-3xl lg:text-[32px] font-extrabold mb-6">Expert help at your door in under 60 minutes</h2>
          <ul className="mb-8 space-y-3">
            {[
              "Verified professionals only",
              "Live tracking from booking to arrival",
              "Transparent pricing, no surprises",
              "Satisfaction guarantee on every job",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 font-medium">
                <span className="text-trust-green font-black">✓</span> {item}
              </li>
            ))}
          </ul>
          <a href="#" className="inline-flex items-center px-7 py-3.5 rounded-lg bg-dark text-dark-foreground font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all">
            Book a Service →
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ForUsers;
