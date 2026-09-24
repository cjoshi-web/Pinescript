import React, { useState } from 'react';
import { X, Copy, Check, Github, Globe, Terminal, Sparkles, Download, Loader2 } from 'lucide-react';
import { downloadProjectZip } from '../services/exportZip';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'gu';
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectZip((msg) => setDownloadMsg(msg));
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
      setDownloadMsg('');
    }
  };

  if (!isOpen) return null;

  const githubWorkflowCode = `name: Deploy NiftyPulse to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const gitCommands = `# 1. Initialize local git repository
git init
git add .
git commit -m "Initial commit: Personal NSE/BSE TradingView & PineScript Terminal"

# 2. Add your GitHub repository remote
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 3. Push code to GitHub
git push -u origin main
`;

  const handleCopyWorkflow = async () => {
    try {
      await navigator.clipboard.writeText(githubWorkflowCode);
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCommands = async () => {
    try {
      await navigator.clipboard.writeText(gitCommands);
      setCopiedCommands(true);
      setTimeout(() => setCopiedCommands(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {language === 'gu' ? 'GitHub Pages પર ફ્રી હોસ્ટ કરવાની રીત' : 'Free GitHub Pages Hosting Guide'}
              </h2>
              <span className="text-xs text-neutral-400">
                {language === 'gu' ? 'લાઇફટાઇમ 100% મફત · કોઈ સર્વર ખર્ચ નહીં' : '100% Free Forever · Zero Server Cost'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-neutral-300">
          {/* Download ZIP Highlight Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-neutral-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'gu' ? 'સંપૂર્ણ પ્રોજેક્ટ .ZIP ફાઈલ ડાઉનલોડ કરો' : 'Download Complete Project (.ZIP)'}
                </span>
              </div>
              <p className="text-neutral-400 text-xs">
                {language === 'gu'
                  ? 'બધા જ React, TypeScript, Pine Script એન્જિન, Vite કન્ફિગ અને GitHub Actions ની ફાઇલો સાથે તૈયાર પેકેજ.'
                  : 'Ready-to-run package containing all source code, Pine Script runner, configs, and GitHub Actions deployer.'}
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shrink-0 disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>
                {isDownloading
                  ? (downloadMsg || (language === 'gu' ? 'ડાઉનલોડિંગ...' : 'Downloading...'))
                  : (language === 'gu' ? 'હમણાં ડાઉનલોડ કરો' : 'Download Now')}
              </span>
            </button>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === 'gu' ? (
                <span>
                  આ પ્રોજેક્ટ પ્યોર ક્લાયન્ટ-સાઇડ <strong>React + Vite + TypeScript</strong> માં બનેલો છે. આથી તમે કોઈ પણ ખર્ચ વગર GitHub Pages પર એકદમ ફ્રી હોસ્ટ કરી શકો છો. તમારી સાઈટ <strong>https://your-username.github.io/repo-name/</strong> પર લાઈવ થઈ જશે.
                </span>
              ) : (
                <span>
                  This application is a 100% client-side <strong>React + Vite + TypeScript</strong> SPA. It requires zero backend servers and can be hosted completely free of charge on GitHub Pages with instant HTTPS and global CDN.
                </span>
              )}
            </p>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-neutral-800 text-emerald-400 flex items-center justify-center text-xs font-mono">1</span>
              <span>{language === 'gu' ? 'સ્ટેપ ૧: GitHub પર નવો Repository બનાવો' : 'Step 1: Create a GitHub Repository'}</span>
            </div>
            <p className="text-neutral-400 pl-7">
              {language === 'gu'
                ? 'GitHub.com પર જાઓ, "New repository" પર ક્લિક કરો અને નામ આપો (દા.ત. "my-nifty-terminal"). Repo ને Public રાખો.'
                : 'Head to GitHub.com, click "New repository", name it (e.g. "my-nifty-terminal"), and keep it Public.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-emerald-400 flex items-center justify-center text-xs font-mono">2</span>
                <span>{language === 'gu' ? 'સ્ટેપ ૨: કોડ પુશ કરવાના કમાન્ડ્સ' : 'Step 2: Push Code via Git Terminal'}</span>
              </div>
              <button
                onClick={handleCopyCommands}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                {copiedCommands ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCommands ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-200 overflow-x-auto">
              {gitCommands}
            </pre>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-emerald-400 flex items-center justify-center text-xs font-mono">3</span>
                <span>
                  {language === 'gu'
                    ? 'સ્ટેપ ૩: GitHub Actions Workflow ફાઈલ ઉમેરો (.github/workflows/deploy.yml)'
                    : 'Step 3: GitHub Actions Workflow (.github/workflows/deploy.yml)'}
                </span>
              </div>
              <button
                onClick={handleCopyWorkflow}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWorkflow ? 'Copied' : 'Copy YAML'}</span>
              </button>
            </div>
            <p className="text-neutral-400 pl-7 text-[11px]">
              {language === 'gu'
                ? 'તમારા પ્રોજેક્ટમાં `.github/workflows/deploy.yml` ફાઈલ બનાવી આ કોડ મૂકો. દર વખતે જ્યારે તમે કોડ પુશ કરશો ત્યારે GitHub આપોઆપ બિલ્ડ કરીને લાઈવ કરી દેશે.'
                : 'Save this file at `.github/workflows/deploy.yml`. Every time you push changes, GitHub will auto-build and deploy your site.'}
            </p>
            <pre className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-300 max-h-48 overflow-y-auto">
              {githubWorkflowCode}
            </pre>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="w-5 h-5 rounded-full bg-neutral-800 text-emerald-400 flex items-center justify-center text-xs font-mono">4</span>
              <span>{language === 'gu' ? 'સ્ટેપ ૪: Settings માં Pages ચાલુ કરો' : 'Step 4: Enable GitHub Pages in Settings'}</span>
            </div>
            <div className="pl-7 space-y-1.5 text-neutral-400">
              <p>
                {language === 'gu'
                  ? '૧. તમારા GitHub Repo માં જાઓ -> "Settings" -> ડાબી બાજુ "Pages" ક્લિક કરો.'
                  : '1. Go to your GitHub Repository -> "Settings" -> Click "Pages" on the left menu.'}
              </p>
              <p>
                {language === 'gu'
                  ? '૨. "Build and deployment" -> Source માં "GitHub Actions" પસંદ કરો.'
                  : '2. Under "Build and deployment", select Source as "GitHub Actions".'}
              </p>
              <p>
                {language === 'gu'
                  ? '૩. બસ! ૨ મિનિટમાં તમારી સાઈટ ફ્રી લાઈવ થઈ જશે.'
                  : '3. Done! Within 2 minutes, your personal terminal will be live on the web.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors"
          >
            {language === 'gu' ? 'બંધ કરો' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
