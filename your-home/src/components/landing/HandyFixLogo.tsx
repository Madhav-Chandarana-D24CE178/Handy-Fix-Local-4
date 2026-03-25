const HandyFixLogo = ({ size = 36, darkBg = false }: { size?: number; darkBg?: boolean }) => (
  <span className="inline-flex items-center gap-2.5 no-underline">
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="14" fill="#E6C04A" />
      <path
        d="M8 52 L8 30 L32 14 L56 30 L56 52"
        fill="none" stroke="#1C1A14" strokeWidth="4.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <rect x="23" y="37" width="14" height="15" rx="3" fill="#1C1A14" />
      <path d="M47 22 L54 15" stroke="#1C1A14" strokeWidth="3" strokeLinecap="round" />
      <circle cx="57" cy="12" r="4.5" fill="none" stroke="#1C1A14" strokeWidth="3" />
    </svg>
    <span
      className="font-heading text-[22px] font-extrabold tracking-tight"
      style={{ color: darkBg ? "#F5EDD5" : "#1C1A14", letterSpacing: "-0.5px" }}
    >
      HandyFix
    </span>
  </span>
);

export default HandyFixLogo;
