// Rasteriza páginas do PDF em PNG usando pdfjs-dist + canvas (para revisão)
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const PDF = 'C:/dev/_vibrotatil/app-modulo-iii/docs/VIBROTATIL-Connect-Modulo-III.pdf';
const OUT = 'C:/dev/_vibrotatil/app-modulo-iii/docs/_rev';
const PAGINAS = process.argv.slice(2).map(Number);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const data = new Uint8Array(fs.readFileSync(PDF));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

  const lista = PAGINAS.length ? PAGINAS : Array.from({ length: doc.numPages }, (_, i) => i + 1);

  for (const n of lista) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1.4 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport }).promise;

    const arquivo = path.join(OUT, `p${String(n).padStart(2, '0')}.png`);
    fs.writeFileSync(arquivo, canvas.toBuffer('image/png'));
    console.log(`✓ p${String(n).padStart(2, '0')}.png`);
  }

  console.log(`Total de páginas no PDF: ${doc.numPages}`);
})();
