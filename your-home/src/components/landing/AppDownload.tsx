import HandyFixLogo from "./HandyFixLogo";

const AppDownload = () => (
  <section className="py-20 bg-dark text-dark-foreground text-center">
    <div className="container">
      <div className="reveal flex justify-center mb-8">
        <svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="16" fill="#E6C04A" />
          <path d="M8 52 L8 30 L32 14 L56 30 L56 52" fill="none" stroke="#1C1A14" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="23" y="37" width="14" height="15" rx="3" fill="#1C1A14" />
          <path d="M47 22 L54 15" stroke="#1C1A14" strokeWidth="3" strokeLinecap="round" />
          <circle cx="57" cy="12" r="4.5" fill="none" stroke="#1C1A14" strokeWidth="3" />
        </svg>
      </div>
      <h2 className="reveal font-heading text-3xl lg:text-[38px] font-extrabold mb-1">Book in 60 seconds.</h2>
      <h2 className="reveal font-heading text-3xl lg:text-[38px] font-extrabold text-primary mb-4">Track in real time.</h2>
      <p className="reveal text-muted-foreground text-base mb-10">Available on iOS and Android</p>
      <div className="reveal flex flex-wrap justify-center gap-5">
        <a href="#" className="flex items-center gap-3 bg-dark-2 border border-dark-3 px-6 py-3 rounded-xl text-left hover:border-primary transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.82 11.78 5.72 12.57 5.72C13.36 5.72 14.84 4.62 16.4 4.8C17.07 4.83 18.89 5.08 20.07 6.74C19.96 6.81 17.62 8.15 17.65 10.94C17.68 14.3 20.59 15.39 20.63 15.4C20.6 15.48 20.15 17.02 19.06 18.61L18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
          <div>
            <span className="block text-[10px] uppercase opacity-60">Download on the</span>
            <strong className="text-base">App Store</strong>
          </div>
        </a>
        <a href="#" className="flex items-center gap-3 bg-dark-2 border border-dark-3 px-6 py-3 rounded-xl text-left hover:border-primary transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.54C2.63 23.21 2.36 22.54 2.55 21.93L4.13 17.21L3.06 15.85C2.55 15.22 2.28 14.42 2.31 13.61V10.39C2.28 9.58 2.55 8.78 3.06 8.15L12 1L20.94 8.15C21.45 8.78 21.72 9.58 21.69 10.39V13.61C21.72 14.42 21.45 15.22 20.94 15.85L19.87 17.21L21.45 21.93C21.64 22.54 21.37 23.21 20.82 23.54L12 18L3.18 23.54Z"/></svg>
          <div>
            <span className="block text-[10px] uppercase opacity-60">Get it on</span>
            <strong className="text-base">Google Play</strong>
          </div>
        </a>
      </div>
      <p className="mt-6 text-sm text-muted-foreground opacity-70">⭐ 4.8 rating · 50,000+ downloads · Free to use</p>
    </div>
  </section>
);

export default AppDownload;
