const EmergencyPage = () => {
  return (
    <main
      className="min-h-screen w-full pt-24 pb-10 px-4"
      style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)" }}
    >
      <section className="max-w-[800px] mx-auto text-center">
        <article
          className="rounded-2xl p-8 md:p-10 mb-6"
          style={{
            background: "#1a1a1a",
            border: "1px solid rgba(255, 68, 68, 0.35)",
          }}
        >
          <div className="text-[64px] leading-none mb-4">🚨</div>
          <h1 className="text-[30px] md:text-[36px] font-bold mb-3" style={{ color: "#FF4444" }}>
            24/7 Emergency Support
          </h1>
          <p className="text-base md:text-[16px] mb-6" style={{ color: "#B0B0B0" }}>
            Get immediate assistance for critical issues
          </p>

          <a
            href="tel:+919876543210"
            className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-[18px] font-bold transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #FFC107 0%, #FFB300 100%)",
              color: "#1a1a1a",
            }}
          >
            Call Now: +91 9876543210
          </a>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="rounded-xl p-5" style={{ background: "#1a1a1a", border: "1px solid #333333" }}>
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-base font-semibold mb-1" style={{ color: "#FFFFFF" }}>Quick Response</h3>
            <p className="text-sm" style={{ color: "#B0B0B0" }}>15 min average</p>
          </div>
          <div className="rounded-xl p-5" style={{ background: "#1a1a1a", border: "1px solid #333333" }}>
            <div className="text-3xl mb-2">🔧</div>
            <h3 className="text-base font-semibold mb-1" style={{ color: "#FFFFFF" }}>Expert Technicians</h3>
            <p className="text-sm" style={{ color: "#B0B0B0" }}>Verified professionals</p>
          </div>
          <div className="rounded-xl p-5" style={{ background: "#1a1a1a", border: "1px solid #333333" }}>
            <div className="text-3xl mb-2">💯</div>
            <h3 className="text-base font-semibold mb-1" style={{ color: "#FFFFFF" }}>Guaranteed Fix</h3>
            <p className="text-sm" style={{ color: "#B0B0B0" }}>Or full refund</p>
          </div>
        </div>

        <p className="text-xs" style={{ color: "#B0B0B0" }}>
          Available 24 hours a day, 7 days a week for urgent repairs
        </p>
      </section>
    </main>
  );
};

export default EmergencyPage;
