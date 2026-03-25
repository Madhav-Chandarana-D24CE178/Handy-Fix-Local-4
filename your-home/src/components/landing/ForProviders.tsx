const ForProviders = () => (
  <section className="py-24 bg-warm-bg" id="for-providers">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="reveal-left">
          <span className="text-primary font-extrabold text-xs uppercase tracking-wider block mb-4">FOR PROFESSIONALS</span>
          <h2 className="font-heading text-3xl lg:text-[32px] font-extrabold mb-6">Turn your skills into daily income</h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card p-4 rounded-xl text-center shadow-sm">
              <p className="font-heading text-xl font-bold text-primary">₹800+</p>
              <p className="text-xs text-muted-foreground mt-1">/ day average</p>
            </div>
            <div className="bg-card p-4 rounded-xl text-center shadow-sm">
              <p className="font-heading text-xl font-bold text-foreground">Flexible</p>
              <p className="text-xs text-muted-foreground mt-1">hours</p>
            </div>
            <div className="bg-card p-4 rounded-xl text-center shadow-sm">
              <p className="font-heading text-xl font-bold text-foreground">14,000+</p>
              <p className="text-xs text-muted-foreground mt-1">earning pros</p>
            </div>
          </div>

          <a href="#" className="inline-flex items-center px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all">
            Join as a Pro →
          </a>
          <p className="text-xs text-muted-foreground mt-3">No registration fee · Start earning in 24 hours</p>
        </div>

        <div className="reveal-right relative">
          <img
            src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600&q=80"
            alt="Worker with tools"
            className="rounded-xl w-full h-[500px] object-cover"
            loading="lazy"
          />
          <div className="absolute top-6 -left-5 lg:-left-10 bg-trust-green text-dark-foreground p-4 rounded-xl shadow-lg z-10 animate-float">
            <p className="text-sm font-bold font-heading">Sunil earned ₹1,580 today 💪</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ForProviders;
