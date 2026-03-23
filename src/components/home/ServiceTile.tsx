import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface ServiceTileProps {
  icon: ReactNode;
  title: string;
  description?: string;
  color: "saffron" | "navy" | "green" | "red" | "purple";
  onClick?: () => void;
  badge?: string;
  size?: "normal" | "large";
}

const colorClasses = {
  saffron: "bg-primary/10 text-primary border-primary/20",
  navy: "bg-secondary/10 text-secondary border-secondary/20",
  green: "bg-success/10 text-success border-success/20",
  red: "bg-destructive/10 text-destructive border-destructive/20",
  purple: "bg-accent/10 text-accent border-accent/20",
};

const iconBgClasses = {
  saffron: "bg-primary text-primary-foreground",
  navy: "bg-secondary text-secondary-foreground",
  green: "bg-success text-success-foreground",
  red: "bg-destructive text-destructive-foreground",
  purple: "bg-accent text-accent-foreground",
};

export default function ServiceTile({
  icon,
  title,
  description,
  color,
  onClick,
  badge,
  size = "normal",
}: ServiceTileProps) {
  return (
    <button
      onClick={onClick}
      className={`service-tile w-full text-left group ${
        size === "large" ? "min-h-[180px]" : ""
      }`}
    >
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
          {badge}
        </span>
      )}

      <div
        className={`service-tile-icon ${iconBgClasses[color]} transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>

      <h3 className="font-heading font-semibold text-foreground text-center">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground text-center mt-1">
          {description}
        </p>
      )}

      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
