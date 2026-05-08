import { Terminal } from "lucide-react";

interface ComingSoonProps {
  section: string;
  etap: string;
}

// Tymczasowy placeholder dla sekcji które powstaną w kolejnych etapach
export default function ComingSoon({ section, etap }: ComingSoonProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Terminal size={40} className="text-cyber-purple mx-auto mb-6 opacity-60" />
        <p className="font-mono text-cyber-muted text-sm mb-2">$ ./build {section}</p>
        <h1 className="font-mono font-bold text-3xl text-cyber-text mb-4">{section}</h1>
        <p className="font-mono text-cyber-muted text-sm">
          <span className="text-cyber-purple">{"// "}</span>
          implementacja w {etap}
        </p>
      </div>
    </div>
  );
}
