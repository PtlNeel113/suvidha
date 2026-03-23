import { ReactNode } from "react";
import { Settings, Volume2, VolumeX, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AIAssistantEnhanced from "@/components/ai/AIAssistantEnhanced";
import { useLanguage } from "@/hooks/useLanguage";

interface KioskLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

const helplines = [
  { number: "1912", label: "Govt Helpline" },
  { number: "108", label: "Ambulance" },
  { number: "100", label: "Police" },
];

export default function KioskLayout({
  children,
  showBackButton = false,
  onBack,
  title,
}: KioskLayoutProps) {
  const { lang, setLang, t, languages } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Tricolor Top Bar */}
      <div className="tricolor-bar" />

      {/* Header */}
      <header className="bg-secondary text-secondary-foreground px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="lg"
                onClick={onBack}
                className="text-secondary-foreground hover:bg-secondary-foreground/10 touch-target"
              >
                ← {t("back")}
              </Button>
            )}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png.jpeg" 
                alt="SUVIDHA Logo" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="font-heading text-xl font-bold tracking-wide">
                  {t("govt_of_india")}
                </h1>
                <p className="text-secondary-foreground/80 text-sm">
                  {t("digital_suvidha")}
                </p>
              </div>
            </div>
          </div>

          {title && (
            <div className="hidden md:block">
              <h2 className="font-heading text-lg font-semibold">{title}</h2>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/20 touch-target"
                >
                  {languages.find((l) => l.code === lang)?.native || "Language"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className="touch-target"
                  >
                    <span className="font-medium">{l.native}</span>
                    <span className="ml-auto text-muted-foreground text-sm">{l.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/20 touch-target"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="touch-target">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuItem className="touch-target">
                  Accessibility Options
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="page-enter">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {helplines.map((hl) => (
              <div key={hl.number} className="helpline-badge">
                <Phone className="w-4 h-4" />
                <span>{hl.number}</span>
                <span className="text-xs opacity-70">({hl.label})</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2026 {t("govt_of_india")}</span>
            <span>•</span>
            <span>Digital India Initiative</span>
          </div>
        </div>
      </footer>

      <AIAssistantEnhanced />
    </div>
  );
}
