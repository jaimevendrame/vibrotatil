// ============================================================
// Capturas de tela para a documentação do Módulo III
// Gera imagens nomeadas por funcionalidade, em estado real do app.
// ============================================================
const { chromium } = require('playwright');
const fs = require('fs');

const RAIZ = 'C:/dev/_vibrotatil/app-modulo-iii';
const IMG = `${RAIZ}/docs/img`;
const APP = 'file:///C:/dev/_vibrotatil/app-modulo-iii/index.html';

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };

(async () => {
  fs.mkdirSync(IMG, { recursive: true });

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  const erros = [];
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', (e) => erros.push(e.message));

  const shots = [];
  async function capturar(nome, opcoes = {}) {
    const caminho = `${IMG}/${nome}.png`;
    await page.screenshot({
      path: caminho,
      fullPage: opcoes.fullPage !== false,
      ...(opcoes.clip ? { clip: opcoes.clip } : {})
    });
    shots.push(nome);
    console.log(`✓ ${nome}.png`);
  }

  const goto = async (viewport) => {
    await page.setViewportSize(viewport);
    await page.goto(APP);
    await page.waitForTimeout(1200);
  };

  const irPara = async (tela) => {
    await page.click(`.nav-item[data-ir-para="${tela}"]`);
    await page.waitForTimeout(600);
  };

  // =========================================================
  // FIG 01 — Tela inicial (estado parado)
  // =========================================================
  await goto(MOBILE);
  await capturar('fig-01-tela-inicial');

  // =========================================================
  // FIG 02 — Scanner em escuta (com ondas e status ativo)
  // =========================================================
  await page.click('#btn-ouvir');
  await page.waitForTimeout(700);
  await capturar('fig-02-scanner-escutando');

  // =========================================================
  // FIG 03 — Resultado de detecção (visual)
  // =========================================================
  await page.waitForTimeout(6000); // aguarda detecção automática
  const detectado = await page.evaluate(() => ({
    titulo: document.getElementById('texto-resultado')?.textContent,
    sub: document.getElementById('subtexto-resultado')?.textContent
  }));
  console.log('  detecção automática:', JSON.stringify(detectado));
  await capturar('fig-03-deteccao-resultado');

  // desliga escuta
  await page.click('#btn-ouvir');
  await page.waitForTimeout(500);

  // =========================================================
  // FIG 04 — Grade de atalhos (6 sons)
  // =========================================================
  const grade = await page.locator('.grade-atalhos').boundingBox();
  await capturar('fig-04-grade-atalhos', {
    fullPage: false,
    clip: { x: 0, y: grade.y - 30, width: 390, height: grade.height + 60 }
  });

  // =========================================================
  // FIG 05 — Toast de alerta
  // =========================================================
  await page.click('.btn-atalho');
  await page.waitForTimeout(500);
  await capturar('fig-05-toast-alerta', {
    fullPage: false,
    clip: { x: 0, y: 500, width: 390, height: 344 }
  });
  await page.waitForTimeout(2500);

  // =========================================================
  // FIG 06 — Histórico populado
  // =========================================================
  await irPara('historico');
  await capturar('fig-06-historico');

  // =========================================================
  // FIG 07 — Histórico vazio (estado inicial)
  // =========================================================
  await page.evaluate(() => {
    localStorage.removeItem('vibrotatil-historico');
  });
  await page.reload();
  await page.waitForTimeout(1000);
  await irPara('historico');
  await capturar('fig-07-historico-vazio');

  // =========================================================
  // FIG 08 — Perfis
  // =========================================================
  await irPara('perfis');
  await capturar('fig-08-perfis');

  // =========================================================
  // FIG 09 — Modal de novo perfil
  // =========================================================
  await page.click('#btn-novo-perfil');
  await page.waitForTimeout(500);
  await capturar('fig-09-modal-novo-perfil');
  await page.click('#btn-fechar-modal-perfil');
  await page.waitForTimeout(400);

  // =========================================================
  // FIG 10 — Ajustes (tema escuro)
  // =========================================================
  await irPara('configuracoes');
  await capturar('fig-10-ajustes-escuro');

  // =========================================================
  // FIG 11 — Ajustes (tema claro)
  // =========================================================
  await page.click('#toggle-tema');
  await page.waitForTimeout(600);
  await capturar('fig-11-ajustes-claro');
  // restaura escuro
  await page.click('#toggle-tema');
  await page.waitForTimeout(400);

  // =========================================================
  // FIG 12 — Tema claro na tela principal
  // =========================================================
  await page.click('#toggle-tema');
  await page.waitForTimeout(500);
  await irPara('principal');
  await capturar('fig-12-tema-claro');

  // restaura tema escuro (o toggle fica na tela de ajustes)
  await irPara('configuracoes');
  await page.click('#toggle-tema');
  await page.waitForTimeout(400);

  // =========================================================
  // FIG 13 — Layout no desktop (moldura mobile)
  // =========================================================
  await goto(DESKTOP);
  await capturar('fig-13-layout-desktop', { fullPage: false });

  // =========================================================
  // FIG 14 — Tela inicial em resolução menor (390x844 real)
  // =========================================================
  await goto(MOBILE);
  await capturar('fig-14-mobile-390');

  console.log('\nTotal de capturas:', shots.length);
  console.log('Erros de console:', erros.length === 0 ? 'nenhum' : erros.join('\n'));

  await browser.close();
})();
