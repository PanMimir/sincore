import { Terminal } from "lucide-react";

interface ComingSoonProps {
  section: string;
  etap: string;
}

export default function ComingSoon({ section, etap }: ComingSoonProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <Terminal size={40} className="mx-auto mb-6 text-accent-primary opacity-60" />
        <p className="mb-2 font-mono text-sm text-text-muted">$ ./build {section}</p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-text-primary">
          {section}
        </h1>
        <p className="font-mono text-sm text-text-muted">
          <span className="text-accent-primary">{"// "}</span>
          implementacja w {etap}
        </p>
      </div>
    </div>
  );
}
