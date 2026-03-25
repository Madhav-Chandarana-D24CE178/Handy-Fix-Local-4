const features = [
  { icon: "🏠", title: "Aadhaar Verified", desc: "Every pro is ID-verified before joining" },
  { icon: "📍", title: "Live GPS Tracking", desc: "Track your pro from acceptance to doorstep" },
  { icon: "💰", title: "Upfront Pricing", desc: "Know the exact price before you confirm" },
  { icon: "⭐", title: "Work Guarantee", desc: "Free redo if you're not 100% satisfied" },
  { icon: "🔒", title: "Background Checked", desc: "Criminal record verified on all providers" },
  { icon: "⚡", title: "2-Minute Response", desc: "Available pros respond within 2 minutes" },
];

const WhyHandyFix = () => (
  <section className="py-24 bg-warm-bg">
    <div className="container">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl lg:text-[34px] font-extrabold">Why 25,000+ customers choose HandyFix</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="reveal bg-card p-6 rounded-[14px] border-l-0 hover:border-l-[3px] border-primary hover:-translate-y-1 transition-all shadow-md"
          >
            <span className="text-3xl block mb-4">{f.icon}</span>
            <h4 className="font-heading text-lg font-bold mb-3">{f.title}</h4>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyHandyFix;
