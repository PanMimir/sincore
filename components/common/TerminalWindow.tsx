"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalLine {
  text: string;
  type: "command" | "output";
}

interface TerminalWindowProps {
  lines: TerminalLine[];
  title?: string;
}

/**
 * Symuluje okno terminala z efektem typowania.
 * Każda linia pojawia się po poprzedniej z opóźnieniem.
 */
export default function TerminalWindow({
  lines,
  title = "nullsec@terminal:~",
}: TerminalWindowProps) {
  // Ile linii już "wpisano"
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (visibleLines >= lines.length) return;

    // Co 600ms pojawia się kolejna linia
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [visibleLines, lines.length]);

  // Migający kursor – zmienia widoczność co 500ms
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor((v) => !v);
    }, 500);
    return () => clearInterval(cursor);
  }, []);

  return (
    <div className="rounded-lg border border-cyber-gray bg-cyber-dark overflow-hidden shadow-glow-purple-sm">
      {/* Pasek tytułu – jak w prawdziwym terminalu */}
      <div className="flex items-center gap-2 px-4 py-3 bg-cyber-darker border-b border-cyber-gray">
        {/* Przyciski okna (dekoracyjne) */}
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-xs text-cyber-muted">{title}</span>
      </div>

      {/* Treść terminala */}
      <div className="p-5 font-mono text-sm space-y-2 min-h-[180px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            {line.type === "command" ? (
              <p className="text-cyber-purple">
                <span className="text-cyber-muted">❯ </span>
                {line.text}
              </p>
            ) : (
              <p className={cn("text-cyber-text/80 pl-4", !line.text && "h-2")}>
                {line.text}
              </p>
            )}
          </div>
        ))}

        {/* Kursor miga na końcu */}
        {visibleLines <= lines.length && (
          <div className="text-cyber-purple">
            <span className="text-cyber-muted">❯ </span>
            <span
              className={cn(
                "inline-block w-2 h-4 bg-cyber-purple align-middle",
                showCursor ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
