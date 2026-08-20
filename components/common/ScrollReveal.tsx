import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Opóźnienie kaskady w sekundach — zgodne ze starym API opartym o framer-motion. */
  delay?: number;
  className?: string;
}

/**
 * Delikatne wejście treści.
 *
 * Nazwa została ze starej wersji, ale komponent nie śledzi już przewijania i nie
 * potrzebuje JavaScriptu. Poprzednia implementacja renderowała treść z opacity: 0
 * i pokazywała ją dopiero po uruchomieniu Reacta — z bezpiecznikiem na 600 ms, który
 * i tak odpalał się dla wszystkiego naraz, więc efekt "przy przewijaniu" nie działał,
 * a koszt (niewidoczna treść do czasu hydracji) zostawał.
 *
 * Teraz to czysty CSS: animacja startuje przy pierwszym renderze, a osoby, które
 * poprosiły system o ograniczenie ruchu, dostają treść bez animacji (globals.css).
 */
export default function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  return (
    <div
      className={cn("fade-rise", className)}
      style={delay ? { animationDelay: `${Math.round(delay * 1000)}ms` } : undefined}
    >
      {children}
    </div>
  );
}
