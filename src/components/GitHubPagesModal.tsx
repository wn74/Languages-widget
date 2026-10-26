import React, { useState } from 'react';
import { X, Check, Copy, Globe } from 'lucide-react';

interface GitHubPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const workflowYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[24px] bg-white border border-black/[0.08] shadow-2xl overflow-hidden text-[#1D1D1F]">
        {/* Apple Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] bg-white/95">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0071E3]" />
            <h3 className="font-semibold text-base tracking-tight text-[#1D1D1F]">
              Deploy to GitHub Pages
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E5E5EA] hover:bg-[#D1D1D6] text-[#1D1D1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F5F5F7]/50 text-xs text-[#1D1D1F]">
          <p className="leading-relaxed text-[#6E6E73]">
            PolyglotClock is architected as a static Single Page Application with relative paths (<code>base: &#39;./&#39;</code>). It runs entirely in the browser and can be hosted for free on <strong>GitHub Pages</strong> with automated deployments.
          </p>

          {/* Steps */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="font-semibold text-[#0071E3] mb-1">Step 1: Relative Base Path Configured</div>
              <p className="text-[#6E6E73] mb-2">
                <code>vite.config.ts</code> already contains <code>base: &#39;./&#39;</code> so all scripts, styles, and assets resolve correctly on any GitHub Pages subpath.
              </p>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F2F2F7] font-mono text-[11px] text-[#1D1D1F]">
                <code>base: &#39;./&#39;</code>
                <button
                  onClick={() => handleCopy("base: './',", 'base')}
                  className="p-1 text-[#0071E3] hover:text-[#0077ED]"
                >
                  {copiedKey === 'base' ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[#0071E3]">Step 2: Automated Deployment Workflow</span>
                <button
                  onClick={() => handleCopy(workflowYaml, 'yaml')}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#0071E3] hover:text-[#0077ED]"
                >
                  {copiedKey === 'yaml' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34C759]" />
                      <span>Copied YAML</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Workflow</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[#6E6E73] mb-2">
                Commit this file to <code>.github/workflows/deploy.yml</code>:
              </p>
              <pre className="p-3 rounded-lg bg-[#F2F2F7] font-mono text-[10px] leading-tight overflow-x-auto text-[#1D1D1F] max-h-36">
                {workflowYaml}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="font-semibold text-[#0071E3] mb-1">Step 3: Enable Pages in GitHub</div>
              <p className="text-[#6E6E73]">
                In your GitHub repo, go to <strong>Settings</strong> &rarr; <strong>Pages</strong> &rarr; Source: <strong>GitHub Actions</strong>. Pushing to <code>main</code> will deploy your PolyglotClock instantly!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-black/[0.06] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
