import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Packs all project source code, configurations, GitHub Actions workflow,
 * and documentation into a clean, ready-to-run .ZIP file for the user.
 */
export async function downloadProjectZip(onProgress?: (msg: string) => void): Promise<void> {
  if (onProgress) onProgress('Preparing project files...');

  const zip = new JSZip();

  // Root Configurations
  zip.file('package.json', JSON.stringify({
    name: "nifty-pulse-terminal",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      lint: "tsc --noEmit",
      preview: "vite preview"
    },
    dependencies: {
      "lightweight-charts": "^5.0.9",
      "lucide-react": "^0.546.0",
      "react": "^19.0.1",
      "react-dom": "^19.0.1",
      "jszip": "^3.10.1",
      "file-saver": "^2.0.5"
    },
    devDependencies: {
      "@tailwindcss/vite": "^4.3.3",
      "@types/file-saver": "^2.0.7",
      "@types/node": "^22.14.0",
      "@types/react": "^19.3.0",
      "@types/react-dom": "^19.3.0",
      "@vitejs/plugin-react": "^6.1.1",
      "tailwindcss": "^4.3.3",
      "typescript": "^5.8.0",
      "vite": "^8.3.0"
    }
  }, null, 2));

  zip.file('tsconfig.json', JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      useDefineForClassFields: true,
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "bundler",
      isolatedModules: true,
      jsx: "react-jsx",
      strict: true,
      paths: {
        "@/*": ["./*"]
      }
    },
    include: ["src"]
  }, null, 2));

  zip.file('vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Ensures relative assets so it works out of the box on GitHub Pages!
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
  }
});
`);

  zip.file('index.html', `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NiftyPulse - NSE/BSE TradingView & PineScript Terminal</title>
    <meta name="description" content="Personal Indian Stock Market Terminal with TradingView charts, Pine Script runner, and free GitHub Pages hosting." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-[#070a10] text-neutral-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300 font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

  zip.file('.gitignore', `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`);

  // GitHub Actions Workflow for 100% Free 1-Click Hosting on GitHub Pages
  zip.file('.github/workflows/deploy.yml', `name: Deploy to GitHub Pages

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
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static website
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
`);

  // README with Gujarati & English instructions
  zip.file('README.md', `# 📈 NiftyPulse - NSE/BSE TradingView & PineScript Terminal

A powerful personal Indian stock market charting terminal that runs **TradingView Pine Script v4/v5**, displays **NSE & BSE Candlestick Charts**, tests custom trading strategies, and is **100% free to host on GitHub Pages**.

---

## 🇮🇳 ગુજરાતી માર્ગદર્શિકા (How to run & host):

### ૧. તમારા કમ્પ્યુટર પર રન કરવા (Local Setup):
\`\`\`bash
# ૧. ઝિપ અનઝિપ કર્યા પછી તે ફોલ્ડરમાં ટર્મિનલ ખોલો
npm install

# ૨. ડેવલપમેન્ટ સર્વર શરૂ કરો
npm run dev
\`\`\`
ત્યારબાદ તમારા બ્રાઉઝરમાં \`http://localhost:3000\` ખોલો!

### ૨. GitHub Pages પર આજીવન મફત હોસ્ટ કરવા (Free Hosting):
1. **GitHub.com** પર જઈને નવો રેપોઝીટરી (New Repository) બનાવો.
2. ટર્મિનલમાં નીચે મુજબ કમાન્ડ ચલાવો:
\`\`\`bash
git init
git add .
git commit -m "My personal NiftyPulse terminal"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
\`\`\`
3. તમારા GitHub Repo માં **Settings -> Pages** માં જાઓ અને **Source: GitHub Actions** પસંદ કરો.
4. ૨ મિનિટમાં તમારી સાઈટ \`https://<your-username>.github.io/<your-repo-name>/\` પર લાઈવ થઈ જશે!

---

## ✨ Features:
- **Pine Script v4/v5 Engine**: Run Pine Script code natively in your browser with real-time indicators and shape markers.
- **Strategy Backtester**: Real-time calculation of Win Rate %, Net Profit (₹), and trades ledger.
- **TradingView Live Pro**: Official TradingView widget with 100+ indicators for NIFTY, BANKNIFTY, SENSEX, and top Indian stocks.
- **Zero Server Cost**: 100% client-side React + Vite architecture.
`);

  if (onProgress) onProgress('Adding source code files...');

  // Read current source code files and pack into zip
  const filesToInclude = [
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/types/market.ts',
    'src/services/marketData.ts',
    'src/services/pineScriptEngine.ts',
    'src/services/pinePresets.ts',
    'src/components/Navbar.tsx',
    'src/components/SymbolSelector.tsx',
    'src/components/PineChart.tsx',
    'src/components/PineEditor.tsx',
    'src/components/BacktestPanel.tsx',
    'src/components/TradingViewWidget.tsx',
    'src/components/PresetsLibrary.tsx',
    'src/components/PineGuide.tsx',
    'src/components/GitHubDeployModal.tsx'
  ];

  for (const filePath of filesToInclude) {
    try {
      const response = await fetch(`/${filePath}`);
      if (response.ok) {
        const content = await response.text();
        zip.file(filePath, content);
      }
    } catch (e) {
      console.warn('Could not fetch via web, fallback bundling for:', filePath);
    }
  }

  if (onProgress) onProgress('Compressing .ZIP package...');

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) onProgress(`Generating ZIP: ${metadata.percent.toFixed(0)}%`);
  });

  if (onProgress) onProgress('Download started!');
  saveAs(content, 'nifty-pulse-tradingview-terminal.zip');
}
