import { useCountUp } from "@/hooks/useCountUp";

const StatItem = ({ target, label, suffix, decimals = 0 }: { target: number; label: string; suffix: string; decimals?: number }) => {
  const { ref, value } = useCountUp(target, 2000, decimals);
  return (
    <div className="text-center relative">
      <span ref={ref} className="font-heading text-4xl lg:text-[44px] font-extrabold text-primary block mb-1">
        {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  );
};

const TrustStats = () => (
  <section className="py-12 border-b border-border bg-card">
    <div className="container">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        <StatItem target={25000} label="Jobs Completed" suffix="+" />
        <StatItem target={1200} label="Verified Professionals" suffix="+" />
        <StatItem target={4.8} label="Average Rating" suffix=" ★" decimals={1} />
        <StatItem target={8} label="Cities Covered" suffix="" />
      </div>
    </div>
  </section>
);

export default TrustStats;
