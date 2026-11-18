// Converte os diagramas SVG em PNG via Chromium headless (Playwright)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const IMG = 'C:/dev/_vibrotatil/app-modulo-iii/docs/img';

(async () => {
  const browser = await chromium.launch({ headless: true });

  const svgs = fs.readdirSync(IMG).filter((f) => f.endsWith('.svg'));

  for (const arquivo of svgs) {
    const svgPath = path.join(IMG, arquivo);
    const svg = fs.readFileSync(svgPath, 'utf8');

    // Extrai dimensões do viewBox
    const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
    const w = vb ? parseInt(vb[1]) : 800;
    const h = vb ? parseInt(vb[2]) : 600;

    const page = await browser.newPage({
      viewport: { width: w, height: h },
      deviceScaleFactor: 2
    });

    await page.setContent(`
      <!DOCTYPE html><html><head><style>
        html,body{margin:0;padding:0;background:#0b1220;}
        svg{display:block;}
      </style></head><body>${svg}</body></html>
    `, { waitUntil: 'networkidle' });

    const png = path.join(IMG, arquivo.replace('.svg', '.png'));
    await page.screenshot({ path: png });
    await page.close();

    console.log(`✓ ${path.basename(png)} (${w}x${h})`);
  }

  await browser.close();
  console.log('\nConversão concluída.');
})();
