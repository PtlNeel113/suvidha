import { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  trend?: string;
}

export default function MetricCard({ icon, value, label, trend }: MetricCardProps) {
  return (
    <div className="metric-card group hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center gap-2 text-secondary mb-2">
        {icon}
        <span className="font-heading text-2xl font-bold">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {trend && (
        <p className="text-xs text-success mt-1 font-medium">{trend}</p>
      )}
    </div>
  );
}
