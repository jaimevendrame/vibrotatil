// ============================================================
// Gera o PDF da documentação a partir do HTML via Chromium headless
// Capa é gerada sem cabeçalho/rodapé e mesclada ao corpo.
// ============================================================
const { chromium } = require('playwright');
const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

const RAIZ = 'C:/dev/_vibrotatil/app-modulo-iii';
const DOCS = `${RAIZ}/docs`;
const HTML = `${DOCS}/documento.html`;
const PDF = `${DOCS}/VIBROTATIL-Connect-Modulo-III.pdf`;
const PDF_CAPA = `${DOCS}/_capa.pdf`;
const PDF_CORPO = `${DOCS}/_corpo.pdf`;

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ---------- PASSAGEM 1: gerar o documento completo ----------
  const page = await browser.newPage();
  console.log('Carregando documento...');
  await page.goto(`file:///${HTML.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });

  // Sumário automático
  const sumario = await page.evaluate(() => {
    const itens = [];
    document.querySelectorAll('h2').forEach((h, i) => {
      const id = h.id || `sec-${i}`;
      h.id = id;
      itens.push({ id, texto: h.textContent, nivel: 2 });
    });
    document.querySelectorAll('h3').forEach((h, i) => {
      const id = h.id || `sub-${i}`;
      h.id = id;
      itens.push({ id, texto: h.textContent, nivel: 3 });
    });
    return itens;
  });

  await page.evaluate((itens) => {
    const ul = document.getElementById('sumario-lista');
    if (!ul) return;
    ul.innerHTML = itens.map((it) => {
      const recuo = it.nivel === 3
        ? 'padding-left:1.4rem;font-size:10.5pt;color:#5a6b82;'
        : '';
      return `<li style="${recuo}"><a href="#${it.id}">${it.texto}</a></li>`;
    }).join('');
  }, sumario);

  // Numeração de figuras e tabelas
  await page.evaluate(() => {
    document.querySelectorAll('figure').forEach((fig, i) => {
      const cap = fig.querySelector('figcaption');
      if (cap && !cap.dataset.num) {
        cap.innerHTML = `<strong>Figura ${i + 1}.</strong> ${cap.innerHTML}`;
      }
    });
    document.querySelectorAll('.tabela-captura').forEach((cap, i) => {
      if (!cap.dataset.num) {
        cap.innerHTML = `<strong>Tabela ${i + 1}.</strong> ${cap.innerHTML}`;
      }
    });
  });

  // Estilos de impressão
  await page.addStyleTag({
    content: `
      @media print {
        .capa { page-break-after: always; break-after: page; }
        .sumario-bloco { page-break-after: always; break-after: page; }
        .secao { page-break-before: always; break-before: page; }
        h2, h3 { page-break-after: avoid; break-after: avoid; }
        figure, table.dados { page-break-inside: avoid; break-inside: avoid; }
      }
    `
  });

  // ---------- PASSAGEM 2: capa isolada (sem cabeçalho/rodapé) ----------
  console.log('Gerando capa...');
  const paginaCapa = await browser.newPage();
  await paginaCapa.goto(`file:///${HTML.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await paginaCapa.addStyleTag({
    content: `
      body > *:not(.capa) { display: none !important; }
      .capa { page-break-after: auto !important; break-after: auto !important; }
    `
  });
  await paginaCapa.pdf({
    path: PDF_CAPA,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: '16mm', bottom: '12mm', left: '16mm', right: '16mm' }
  });

  // ---------- PASSAGEM 3: corpo (sem capa, com cabeçalho/rodapé) ----------
  console.log('Gerando corpo...');
  await page.addStyleTag({
    content: `
      .capa { display: none !important; }
    `
  });

  await page.pdf({
    path: PDF_CORPO,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size:7.5pt;color:#8fa0b4;width:100%;padding:0 16mm;
                  font-family:Segoe UI,sans-serif;display:flex;justify-content:space-between;
                  border-bottom:0.5px solid #d8e0ea;padding-bottom:2mm;">
        <span>VIBROTÁTIL® Connect, Protótipo do Módulo III</span>
        <span>&nbsp;</span>
      </div>`,
    footerTemplate: `
      <div style="font-size:7.5pt;color:#8fa0b4;width:100%;padding:0 16mm;
                  font-family:Segoe UI,sans-serif;display:flex;justify-content:space-between;
                  border-top:0.5px solid #d8e0ea;padding-top:2mm;">
        <span>Documento técnico · versão 1.0 · 17/11/2026</span>
        <span class="marcador-pagina"></span>
      </div>`,
    margin: { top: '20mm', bottom: '16mm', left: '16mm', right: '16mm' }
  });

  await browser.close();

  // ---------- PASSAGEM 4: mesclar ----------
  console.log('Mesclando...');
  const pdfCapa = await PDFDocument.load(fs.readFileSync(PDF_CAPA));
  const pdfCorpo = await PDFDocument.load(fs.readFileSync(PDF_CORPO));

  const pdfFinal = await PDFDocument.create();
  const paginasCapa = await pdfFinal.copyPages(pdfCapa, pdfCapa.getPageIndices());
  paginasCapa.forEach((p) => pdfFinal.addPage(p));
  const paginasCorpo = await pdfFinal.copyPages(pdfCorpo, pdfCorpo.getPageIndices());
  paginasCorpo.forEach((p) => pdfFinal.addPage(p));

  // ---------- PASSAGEM 5: numerar as páginas no documento final ----------
  console.log('Numerando páginas...');
  const fontes = await pdfFinal.embedFont('Helvetica');
  const total = pdfFinal.getPageCount();

  pdfFinal.getPages().forEach((pagina, i) => {
    if (i === 0) return; // capa sem numeração

    const { width, height } = pagina.getSize();
    const texto = `página ${i} de ${total - 1}`;
    const tam = 7.5;

    const larguraTexto = fontes.widthOfTextAtSize(texto, tam);
    pagina.drawText(texto, {
      x: width - 16 / 25.4 * 72 - larguraTexto,
      y: 16 / 25.4 * 72 - 4,
      size: tam,
      font: fontes,
      color: rgb(0.56, 0.63, 0.71)
    });
  });

  fs.writeFileSync(PDF, await pdfFinal.save());

  // limpa temporários
  fs.unlinkSync(PDF_CAPA);
  fs.unlinkSync(PDF_CORPO);

  const kb = (fs.statSync(PDF).size / 1024).toFixed(0);
  console.log(`✓ PDF gerado: ${PDF} (${kb} KB)`);
  console.log(`✓ ${pdfFinal.getPageCount()} páginas · ${sumario.length} seções no sumário`);
})();
