const steps = [
  { num: "1", title: "Post Your Job", desc: "Tell us what you need and share your location" },
  { num: "2", title: "Get Matched", desc: "A nearby verified pro accepts your request instantly" },
  { num: "3", title: "Job Done", desc: "Track live, get it fixed, pay only after satisfaction" },
];

const HowItWorks = () => (
  <section className="py-24 bg-card" id="how-it-works">
    <div className="container">
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl lg:text-[34px] font-extrabold mb-3">How HandyFix works</h2>
        <p className="text-muted-foreground">Book a service in under 2 minutes</p>
      </div>

      <div className="relative grid md:grid-cols-3 gap-16">
        {/* Dashed connector line */}
        <div className="hidden md:block absolute top-10 left-[15%] w-[70%] h-0.5 border-t-2 border-dashed border-border z-0" />

        {steps.map((s, i) => (
          <div key={s.num} className="reveal text-center relative z-10" style={{ transitionDelay: `${i * 200}ms` }}>
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-3xl font-extrabold font-heading shadow-[0_10px_20px_rgba(255,90,31,0.2)]">
              {s.num}
            </div>
            <h4 className="font-heading text-xl font-bold mb-3">{s.title}</h4>
            <p className="text-muted-foreground text-[15px]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
