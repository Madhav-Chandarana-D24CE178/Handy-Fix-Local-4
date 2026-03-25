const PromoBanners = () => (
  <section className="py-24 bg-card">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="reveal-left bg-primary text-primary-foreground p-7 rounded-2xl relative overflow-hidden min-h-[160px] stripe-pattern">
          <h3 className="font-heading text-xl font-extrabold mb-2 relative z-10">🎉 First Service FREE</h3>
          <p className="text-sm mb-5 opacity-90 relative z-10">Use code FIRST50 on your first booking</p>
          <a href="#" className="relative z-10 inline-flex items-center px-4 py-2 rounded-lg border border-card/40 text-card font-semibold text-sm hover:bg-card/10 transition-all">
            Claim Offer →
          </a>
        </div>
        <div className="reveal bg-dark text-dark-foreground p-7 rounded-2xl relative overflow-hidden min-h-[160px] dot-pattern">
          <h3 className="font-heading text-xl font-extrabold mb-2 relative z-10">💼 Become a HandyFix Pro</h3>
          <p className="text-sm mb-5 opacity-90 relative z-10">Earn ₹800+ daily. Flexible hours. Zero investment.</p>
          <a href="#" className="relative z-10 inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 transition-all">
            Start Earning →
          </a>
        </div>
        <div className="reveal-right bg-trust-green text-dark-foreground p-7 rounded-2xl relative overflow-hidden min-h-[160px] dot-pattern">
          <h3 className="font-heading text-xl font-extrabold mb-2 relative z-10">🛡️ 100% Verified Pros</h3>
          <p className="text-sm mb-5 opacity-90 relative z-10">Aadhaar checked, background verified, insured</p>
          <a href="#" className="relative z-10 inline-flex items-center px-4 py-2 rounded-lg border border-card/40 text-card font-semibold text-sm hover:bg-card/10 transition-all">
            Know More →
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default PromoBanners;
