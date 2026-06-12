// MOYO Layout Component
// Academic Crimson Design System
// Mobile-first single column layout with fixed header

import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  headerRight?: React.ReactNode;
}

export default function Layout({
  children,
  title,
  showBack = false,
  onBack,
  headerRight,
}: LayoutProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {showBack ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 btn-press -ml-1 px-1 py-1 rounded-md"
            >
              <ArrowLeft size={18} />
              <span>뒤로</span>
            </button>
          ) : (
            <div className="w-16" />
          )}

          {title && (
            <h1 className="text-[15px] font-semibold text-foreground absolute left-1/2 -translate-x-1/2">
              {title}
            </h1>
          )}

          <div className="w-16 flex justify-end">
            {headerRight}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
