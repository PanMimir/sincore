#!/bin/bash
# Bulk replacement: cyberpunk tokens → silent industrial tokens (brand v2).
# Idempotent — safe to re-run.

set -euo pipefail
cd "$(dirname "$0")/.."

FILES=(
  "app/[locale]/services/page.tsx"
  "app/[locale]/projects/ProjectsClient.tsx"
  "app/[locale]/projects/[slug]/page.tsx"
  "app/[locale]/contact/ContactContent.tsx"
  "app/[locale]/stack/TechStackContent.tsx"
  "app/[locale]/knowledge/[slug]/page.tsx"
  "app/[locale]/knowledge/KnowledgeClient.tsx"
  "app/[locale]/about/AboutContent.tsx"
)

for f in "${FILES[@]}"; do
  # Background / surface
  sed -i \
    -e 's/bg-cyber-black/bg-background/g' \
    -e 's/bg-cyber-darker/bg-surface-elevated/g' \
    -e 's/bg-cyber-dark/bg-surface/g' \
    -e 's/bg-cyber-gray/bg-surface-elevated/g' \
    -e 's/bg-cyber-purple-bright/bg-accent-hover/g' \
    -e 's/bg-cyber-purple-dim/bg-accent-800/g' \
    -e 's/bg-cyber-purple/bg-accent-primary/g' \
    -e 's/bg-cyber-cyan/bg-accent-500/g' \
    -e 's/bg-cyber-green/bg-success-500/g' \
    -e 's/bg-cyber-red/bg-error-500/g' \
    -e 's/bg-cyber-muted/bg-text-muted/g' \
    \
    -e 's/text-cyber-text/text-text-primary/g' \
    -e 's/text-cyber-muted/text-text-muted/g' \
    -e 's/text-cyber-purple-bright/text-accent-hover/g' \
    -e 's/text-cyber-purple-dim/text-accent-800/g' \
    -e 's/text-cyber-purple/text-accent-primary/g' \
    -e 's/text-cyber-cyan/text-accent-500/g' \
    -e 's/text-cyber-green/text-success-400/g' \
    -e 's/text-cyber-red/text-error-400/g' \
    -e 's/text-yellow-400/text-warning-400/g' \
    \
    -e 's/border-cyber-gray/border-border-subtle/g' \
    -e 's/border-cyber-purple-bright/border-accent-hover/g' \
    -e 's/border-cyber-purple/border-accent-primary/g' \
    -e 's/border-cyber-cyan/border-accent-500/g' \
    -e 's/border-cyber-green/border-success-500/g' \
    -e 's/border-cyber-red/border-error-500/g' \
    -e 's/border-cyber-muted/border-text-muted/g' \
    -e 's/border-yellow-400/border-warning-400/g' \
    \
    -e 's/hover:shadow-glow-purple-sm//g' \
    -e 's/hover:shadow-glow-purple//g' \
    -e 's/shadow-glow-purple-sm//g' \
    -e 's/shadow-glow-purple//g' \
    -e 's/shadow-glow-cyan//g' \
    -e 's/  *"/"/g' \
    \
    -e 's/duration-200/duration-fast/g' \
    -e 's/duration-300/duration-normal/g' \
    "$f"
done

echo "Migration done. Files processed: ${#FILES[@]}"
