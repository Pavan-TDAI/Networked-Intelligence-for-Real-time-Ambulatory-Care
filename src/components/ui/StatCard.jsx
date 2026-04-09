import { cn } from "../../lib/utils";

export function StatCard({ label, value, tone = "default", className }) {
  const toneClass =
    tone === "accent"
      ? "bg-gradient-to-br from-brand-midnight to-[#2d3a65] text-white border-brand-sky/20"
      : tone === "soft"
        ? "bg-brand-mint/60 text-brand-midnight border-brand-sky/20"
        : "bg-white/90 text-ink border-line/50";

  return (
    <div className={cn("stat-glow rounded-2xl border p-5", toneClass, className)}>
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
