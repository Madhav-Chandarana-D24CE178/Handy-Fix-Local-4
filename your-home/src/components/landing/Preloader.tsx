import { useEffect, useState } from "react";

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1000);
    const removeTimer = setTimeout(() => setVisible(false), 1400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-card flex flex-col items-center justify-center transition-opacity duration-400 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[spin_0.8s_ease-in-out_1]"
      >
        <rect width="64" height="64" rx="16" fill="#E6C04A" />
        <path
          d="M8 52 L8 30 L32 14 L56 30 L56 52"
          fill="none" stroke="#1C1A14" strokeWidth="4.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
        <rect x="23" y="37" width="14" height="15" rx="3" fill="#1C1A14" />
        <path d="M47 22 L54 15" stroke="#1C1A14" strokeWidth="3" strokeLinecap="round" />
        <circle cx="57" cy="12" r="4.5" fill="none" stroke="#1C1A14" strokeWidth="3" />
      </svg>
      <span className="font-heading text-2xl font-extrabold mt-4 text-foreground tracking-tight">
        HandyFix
      </span>
    </div>
  );
};

export default Preloader;
