const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const erros = [];
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', (e) => erros.push(e.message));

  // ===== DESKTOP (1440x900) =====
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('file:///C:/dev/_vibrotatil/app-modulo-iii/index.html');
  await page.waitForTimeout(1500);

  console.log('===== DESKTOP 1440x900 =====');

  const desktop = await page.evaluate(() => {
    const cont = document.querySelector('.app-container');
    const nav = document.querySelector('.nav-inferior');
    const tema = document.documentElement.getAttribute('data-tema');
    const bodyBg = getComputedStyle(document.body).backgroundColor;

    const cr = cont.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();

    return {
      tema,
      bodyBg,
      containerLargura: Math.round(cr.width),
      containerAltura: Math.round(cr.height),
      containerCentroX: Math.round(cr.left + cr.width / 2),
      centroViewport: window.innerWidth / 2,
      navLargura: Math.round(nr.width),
      navCentroX: Math.round(nr.left + nr.width / 2),
      navAlinhado: Math.abs((nr.left + nr.width / 2) - (cr.left + cr.width / 2)) < 2,
      navDentroContainer: nr.left >= cr.left - 1 && nr.right <= cr.right + 1
    };
  });
  console.log(desktop);
  console.log(`Tema escuro padrão: ${desktop.tema === 'escuro' ? '✓' : '✗'}`);
  console.log(`Container centralizado: ${Math.abs(desktop.containerCentroX - desktop.centroViewport) < 2 ? '✓' : '✗'}`);
  console.log(`Nav alinhada ao container: ${desktop.navAlinhado && desktop.navDentroContainer ? '✓' : '✗'}`);
  console.log(`Largura mobile (≤430): ${desktop.containerLargura <= 430 ? '✓' : '✗'} (${desktop.containerLargura}px)`);

  await page.screenshot({ path: 'C:/dev/_vibrotatil/app-modulo-iii/shot-desktop.png' });

  // ===== MOBILE (390x844) =====
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);

  console.log('\n===== MOBILE 390x844 =====');
  const mobile = await page.evaluate(() => {
    const cont = document.querySelector('.app-container');
    const nav = document.querySelector('.nav-inferior');
    const cr = cont.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    return {
      containerLargura: Math.round(cr.width),
      navLargura: Math.round(nr.width),
      navDentroContainer: nr.left >= cr.left - 1 && nr.right <= cr.right + 1
    };
  });
  console.log(mobile);
  console.log(`Container ocupa tela: ${mobile.containerLargura === 390 ? '✓' : '✗'}`);
  console.log(`Nav dentro do container: ${mobile.navDentroContainer ? '✓' : '✗'}`);

  // ===== Regressão funcional =====
  console.log('\n===== FUNCIONAL =====');
  for (const destino of ['historico', 'perfis', 'configuracoes', 'principal']) {
    await page.click(`.nav-item[data-ir-para="${destino}"]`);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const ativas = Array.from(document.querySelectorAll('.tela'))
        .filter((t) => getComputedStyle(t).display !== 'none').map((t) => t.id);
      return { ativas, nav: document.querySelector('.nav-item.ativo')?.dataset.irPara };
    });
    const ok = r.ativas.length === 1 && r.ativas[0] === `tela-${destino}` && r.nav === destino;
    console.log(`${ok ? '✓' : '✗'} ${destino}`);
  }

  // Tema claro manual
  await page.click('.nav-item[data-ir-para="configuracoes"]');
  await page.waitForTimeout(300);
  await page.click('#toggle-tema');
  await page.waitForTimeout(300);
  const temaClaro = await page.evaluate(() => document.documentElement.getAttribute('data-tema'));
  console.log(`\nToggle para claro: ${temaClaro === 'claro' ? '✓' : '✗'}`);

  // Volta para escuro
  await page.click('#toggle-tema');
  await page.waitForTimeout(300);
  const temaEscuro = await page.evaluate(() => document.documentElement.getAttribute('data-tema'));
  console.log(`Toggle para escuro: ${temaEscuro === 'escuro' ? '✓' : '✗'}`);

  // Detecção
  await page.click('.nav-item[data-ir-para="principal"]');
  await page.waitForTimeout(300);
  await page.click('.btn-atalho');
  await page.waitForTimeout(500);
  const det = await page.evaluate(() => document.getElementById('texto-resultado')?.textContent);
  console.log(`Detecção: ${det ? '✓' : '✗'} (${det})`);

  // Screenshots finais (mobile)
  for (const tela of ['principal', 'historico', 'perfis', 'configuracoes']) {
    await page.click(`.nav-item[data-ir-para="${tela}"]`);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `C:/dev/_vibrotatil/app-modulo-iii/shot-${tela}.png`,
      fullPage: true
    });
  }
  console.log('Screenshots mobile atualizados.');

  console.log('\n===== ERROS =====');
  console.log(erros.length === 0 ? 'Nenhum erro.' : erros.join('\n'));

  await browser.close();
})();
