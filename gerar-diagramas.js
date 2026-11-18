// ============================================================
// Diagramas SVG do protótipo Módulo III
// Gera os 5 diagramas da documentação com os design tokens do app.
// ============================================================
const fs = require('fs');

const IMG = 'C:/dev/_vibrotatil/app-modulo-iii/docs/img';
fs.mkdirSync(IMG, { recursive: true });

// Tokens da marca (espelham css/style.css)
const C = {
  fundo: '#0b1220',
  superficie: '#1e293b',
  fundoAlt: '#162135',
  primaria: '#0b6ba4',
  primariaEscura: '#08558a',
  secundaria: '#2dd4bf',
  destaque: '#f59e0b',
  sucesso: '#16a34a',
  erro: '#dc2626',
  texto: '#e2e8f0',
  textoSuave: '#94a3b8',
  borda: '#2b3a52'
};

const F = 'font-family="Segoe UI, system-ui, sans-serif"';

function cabecalho(titulo, subtitulo, largura) {
  return `
  <rect width="${largura}" height="${largura < 600 ? 300 : 340}" fill="${C.fundo}"/>
  <text x="30" y="48" ${F} font-size="24" font-weight="700" fill="${C.texto}">${titulo}</text>
  <text x="30" y="76" ${F} font-size="14" fill="${C.textoSuave}">${subtitulo}</text>
  <rect x="30" y="92" width="${largura - 60}" height="2" fill="${C.borda}"/>`;
}

function rodape(legenda, largura, altura) {
  return `
  <text x="30" y="${altura - 24}" ${F} font-size="12" fill="${C.textoSuave}">${legenda}</text>`;
}

// ============================================================
// DIAGRAMA 1 — Arquitetura em camadas
// ============================================================
function diagramaArquitetura() {
  const W = 980, H = 620;
  const camadas = [
    {
      y: 120, h: 92, cor: C.primaria, titulo: 'CAMADA DE INTERFACE (HTML + CSS)',
      itens: ['index.html: 4 telas', 'css/style.css: design tokens', 'Layout mobile fixo 430px', 'Tema claro/escuro']
    },
    {
      y: 232, h: 92, cor: C.secundaria, titulo: 'CAMADA DE COMPORTAMENTO (JavaScript)',
      itens: ['app.js: 12 funções', 'Navegação e renderização', 'Simulação de detecção', 'Feedback tátil e visual']
    },
    {
      y: 344, h: 92, cor: C.destaque, titulo: 'CAMADA DE DADOS SIMULADOS',
      itens: ['6 sons pré-definidos', '4 perfis iniciais', '3 dispositivos', 'Padrões de vibração']
    },
    {
      y: 456, h: 92, cor: C.primariaEscura, titulo: 'CAMADA DE PERSISTÊNCIA (localStorage)',
      itens: ['vibrotatil-tema', 'vibrotatil-historico', 'Preferências do usuário', 'Sobrevive ao fechamento']
    }
  ];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecalho('Arquitetura em Camadas', 'Organização do protótipo, em que cada camada é independente e substituível', W);

  camadas.forEach((camada, i) => {
    svg += `
    <rect x="30" y="${camada.y}" width="${W - 60}" height="${camada.h}" rx="12" fill="${C.superficie}" stroke="${camada.cor}" stroke-width="2"/>
    <rect x="30" y="${camada.y}" width="8" height="${camada.h}" rx="4" fill="${camada.cor}"/>
    <text x="58" y="${camada.y + 30}" ${F} font-size="15" font-weight="700" fill="${camada.cor}">${camada.titulo}</text>
    ${camada.itens.map((item, j) => `
      <rect x="${58 + j * 218}" y="${camada.y + 44}" width="200" height="34" rx="6" fill="${C.fundoAlt}"/>
      <text x="${68 + j * 218}" y="${camada.y + 66}" ${F} font-size="12" fill="${C.texto}">${item}</text>
    `).join('')}`;

    if (i < camadas.length - 1) {
      const ay = camada.y + camada.h + 4;
      svg += `
      <path d="M ${W / 2} ${ay} L ${W / 2} ${ay + 16}" stroke="${C.textoSuave}" stroke-width="2" marker-end="url(#seta)"/>
      <text x="${W / 2 + 12}" y="${ay + 13}" ${F} font-size="11" fill="${C.textoSuave}">fluxo</text>`;
    }
  });

  svg += `
  <defs>
    <marker id="seta" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="${C.textoSuave}"/>
    </marker>
  </defs>`;

  // Bloco lateral: o que está fora do protótipo
  svg += `
  <rect x="700" y="120" width="250" height="428" rx="12" fill="none" stroke="${C.erro}" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="716" y="146" ${F} font-size="13" font-weight="700" fill="${C.erro}">FORA DO ESCOPO</text>
  <text x="716" y="172" ${F} font-size="12" fill="${C.textoSuave}">• Microfone real</text>
  <text x="716" y="194" ${F} font-size="12" fill="${C.textoSuave}">• DSP / FFT</text>
  <text x="716" y="216" ${F} font-size="12" fill="${C.textoSuave}">• Classificação por IA</text>
  <text x="716" y="238" ${F} font-size="12" fill="${C.textoSuave}">• Bluetooth (BLE)</text>
  <text x="716" y="260" ${F} font-size="12" fill="${C.textoSuave}">• Empacotamento nativo</text>
  <text x="716" y="282" ${F} font-size="12" fill="${C.textoSuave}">• Notificações push</text>
  <text x="716" y="304" ${F} font-size="12" fill="${C.textoSuave}">• Permissões do SO</text>
  <text x="716" y="330" ${F} font-size="11" fill="${C.textoSuave}" font-style="italic">Camadas produzem o</text>
  <text x="716" y="348" ${F} font-size="11" fill="${C.textoSuave}" font-style="italic">mesmo contrato de dados.</text>
  <text x="716" y="370" ${F} font-size="11" fill="${C.textoSuave}" font-style="italic">Substituir a camada de</text>
  <text x="716" y="388" ${F} font-size="11" fill="${C.textoSuave}" font-style="italic">simulação pela real não</text>
  <text x="716" y="406" ${F} font-size="11" fill="${C.textoSuave}" font-style="italic">altera as telas.</text>`;

  svg += rodape('Figura 2. Camadas do protótipo. A camada de dados simulados é o ponto de substituição pelo motor real de classificação.', W, H);
  svg += `</svg>`;

  fs.writeFileSync(`${IMG}/diag-01-arquitetura.svg`, svg);
  console.log('✓ diag-01-arquitetura.svg');
}

// ============================================================
// DIAGRAMA 2 — Ciclo de detecção de som
// ============================================================
function diagramaCiclo() {
  const W = 760, H = 760;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecalho('Ciclo de Detecção de Som', 'Fluxo do gatilho até o registro no histórico', W);
  svg += `<defs><marker id="seta2" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
    <path d="M 0 0 L 9 4.5 L 0 9 z" fill="${C.secundaria}"/></marker></defs>`;

  const etapas = [
    { y: 118, titulo: '1. Usuário toca em "Ouvir ambiente"', desc: 'Aciona o botão principal (btn-ouvir)', cor: C.primaria },
    { y: 196, titulo: '2. Estado: escutando = true', desc: 'Animação de ondas + status "Microfone ativo"', cor: C.primaria },
    { y: 274, titulo: '3. Timer aleatório (2–5 s)', desc: 'Simula o tempo de análise do ambiente', cor: C.destaque },
    { y: 352, titulo: '4. Sorteio de um som simulado', desc: '6 categorias disponíveis (campainha, buzina, choro…)', cor: C.destaque },
    { y: 430, titulo: '5. Feedback visual na tela', desc: 'Ícone + nome do evento + destino do dispositivo', cor: C.secundaria },
    { y: 508, titulo: '6. Feedback tátil', desc: 'navigator.vibrate() com padrão por tipo de som', cor: C.secundaria },
    { y: 586, titulo: '7. Registro no histórico', desc: 'localStorage: vibrotatil-historico (máx. 100 itens)', cor: C.primariaEscura }
  ];

  etapas.forEach((e, i) => {
    svg += `
    <rect x="110" y="${e.y}" width="540" height="60" rx="10" fill="${C.superficie}" stroke="${e.cor}" stroke-width="2"/>
    <circle cx="142" cy="${e.y + 30}" r="14" fill="${e.cor}"/>
    <text x="142" y="${e.y + 35}" ${F} font-size="13" font-weight="700" fill="${C.fundo}" text-anchor="middle">${i + 1}</text>
    <text x="170" y="${e.y + 25}" ${F} font-size="14" font-weight="600" fill="${C.texto}">${e.titulo}</text>
    <text x="170" y="${e.y + 45}" ${F} font-size="12" fill="${C.textoSuave}">${e.desc}</text>`;

    if (i < etapas.length - 1) {
      svg += `<path d="M 380 ${e.y + 62} L 380 ${e.y + 76}" stroke="${C.secundaria}" stroke-width="2" marker-end="url(#seta2)"/>`;
    }
  });

  // Loop
  svg += `
  <path d="M 110 616 L 60 616 L 60 148 L 108 148" fill="none" stroke="${C.secundaria}" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#seta2)"/>
  <text x="20" y="390" ${F} font-size="11" fill="${C.secundaria}" transform="rotate(-90 20 390)" text-anchor="middle">reincide a cada 5 s enquanto escutando</text>`;

  svg += rodape('Figura 3. Ciclo do scanner. O passo 4 (sorteio) é o ponto exato a substituir por classificação real via DSP + IA.', W, H);
  svg += `</svg>`;
  fs.writeFileSync(`${IMG}/diag-02-ciclo-deteccao.svg`, svg);
  console.log('✓ diag-02-ciclo-deteccao.svg');
}

// ============================================================
// DIAGRAMA 3 — Navegação entre telas
// ============================================================
function diagramaNavegacao() {
  const W = 980, H = 460;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecalho('Mapa de Navegação', 'Barra inferior global + botões de retorno por tela', W);
  svg += `<defs><marker id="seta3" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
    <path d="M 0 0 L 9 4.5 L 0 9 z" fill="${C.textoSuave}"/></marker></defs>`;

  const telas = [
    { id: 'tela-principal', nome: 'Início', x: 390, y: 120, cor: C.primaria, desc: 'Scanner + atalhos' },
    { id: 'tela-historico', nome: 'Histórico', x: 90, y: 290, cor: C.secundaria, desc: 'Alertas registrados' },
    { id: 'tela-perfis', nome: 'Perfis', x: 390, y: 290, cor: C.destaque, desc: 'Casa, Rua, Trabalho, Noite' },
    { id: 'tela-configuracoes', nome: 'Ajustes', x: 690, y: 290, cor: C.primariaEscura, desc: 'Acessibilidade e tema' }
  ];

  telas.forEach((t) => {
    svg += `
    <rect x="${t.x}" y="${t.y}" width="200" height="84" rx="12" fill="${C.superficie}" stroke="${t.cor}" stroke-width="2.5"/>
    <text x="${t.x + 100}" y="${t.y + 32}" ${F} font-size="16" font-weight="700" fill="${C.texto}" text-anchor="middle">${t.nome}</text>
    <text x="${t.x + 100}" y="${t.y + 55}" ${F} font-size="12" fill="${C.textoSuave}" text-anchor="middle">${t.desc}</text>
    <text x="${t.x + 100}" y="${t.y + 73}" ${F} font-size="10" fill="${C.textoSuave}" text-anchor="middle" font-style="italic">${t.id}</text>`;
  });

  // Setas da barra inferior
  const navY = 415;
  svg += `
  <rect x="330" y="${navY}" width="320" height="34" rx="8" fill="${C.fundoAlt}" stroke="${C.borda}"/>
  <text x="490" y="${navY + 22}" ${F} font-size="12" font-weight="600" fill="${C.textoSuave}" text-anchor="middle">BARRA INFERIOR GLOBAL (sempre visível)</text>`;

  const setas = [
    { de: 400, para: 190, y1: 204, y2: 288 },
    { de: 490, para: 490, y1: 204, y2: 288 },
    { de: 580, para: 790, y1: 204, y2: 288 }
  ];
  setas.forEach((s) => {
    svg += `<path d="M ${s.de} ${s.y1} L ${s.de} ${s.y1 + 20} L ${s.para} ${s.y1 + 20} L ${s.para} ${s.y2}" fill="none" stroke="${C.textoSuave}" stroke-width="1.8" marker-end="url(#seta3)"/>`;
  });

  // Retorno
  svg += `
  <path d="M 190 374 L 190 396 L 400 396 L 400 206" fill="none" stroke="${C.primaria}" stroke-width="1.8" stroke-dasharray="5 4" marker-end="url(#seta3)"/>
  <text x="292" y="410" ${F} font-size="11" fill="${C.primaria}" text-anchor="middle">botão ← (retorna a Início)</text>`;

  svg += `
  <text x="30" y="${H - 50}" ${F} font-size="12" fill="${C.textoSuave}">
    <tspan x="30" dy="0">Regras: (1) apenas uma tela visível por vez (.tela.ativa);</tspan>
    <tspan x="30" dy="18">(2) o modal de perfil fecha automaticamente ao trocar de tela;</tspan>
    <tspan x="30" dy="18">(3) o item ativo da barra inferior acompanha a tela exibida.</tspan>
  </text>`;

  svg += rodape('Figura 4. Navegação. A barra inferior fica fora das seções para permanecer visível em todas as telas.', W, H);
  svg += `</svg>`;
  fs.writeFileSync(`${IMG}/diag-03-navegacao.svg`, svg);
  console.log('✓ diag-03-navegacao.svg');
}

// ============================================================
// DIAGRAMA 4 — Padrões vibratórios por evento
// ============================================================
function diagramaVibracao() {
  const W = 980, H = 620;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecalho('Padrões Vibratórios por Evento', 'Sequências passadas ao navigator.vibrate(), com duração em milissegundos', W);

  const padroes = [
    { nome: 'Campainha', icone: '🔔', dest: 'WRIST', seq: [400, 200, 200, 200], desc: 'Pulso longo + 2 curtos' },
    { nome: 'Buzina', icone: '🚗', dest: 'WRIST', seq: [300, 150, 300], desc: '2 pulsos rápidos' },
    { nome: 'Choro de bebê', icone: '👶', dest: 'CHEST', seq: [600, 200, 600, 200, 600], desc: '3 pulsos longos' },
    { nome: 'Alarme', icone: '🚨', dest: 'WRIST', seq: [200, 100, 200, 100, 200, 100, 200], desc: 'Sequência rápida repetitiva' },
    { nome: 'Chamada', icone: '📞', dest: 'WRIST', seq: [500, 300, 500], desc: 'Vibração contínua curta' },
    { nome: 'Voz humana', icone: '🗣️', dest: 'BONE', seq: [300, 150, 300, 150, 300], desc: 'Padrão de fala' }
  ];

  const escala = 0.62; // ms -> px
  let y = 130;

  padroes.forEach((p) => {
    svg += `
    <text x="30" y="${y}" ${F} font-size="16" font-weight="700" fill="${C.texto}">${p.icone}  ${p.nome}</text>
    <rect x="240" y="${y - 22}" width="76" height="20" rx="10" fill="${C.fundoAlt}" stroke="${C.borda}"/>
    <text x="278" y="${y - 8}" ${F} font-size="10" font-weight="700" fill="${C.secundaria}" text-anchor="middle">${p.dest}</text>
    <text x="330" y="${y}" ${F} font-size="12" fill="${C.textoSuave}">${p.desc}</text>`;

    let x = 30;
    const yBarra = y + 16;
    p.seq.forEach((ms, i) => {
      const w = Math.max(ms * escala, 8);
      if (i % 2 === 0) {
        svg += `<rect x="${x}" y="${yBarra}" width="${w}" height="26" rx="5" fill="${C.secundaria}"/>`;
        svg += `<text x="${x + w / 2}" y="${yBarra + 18}" ${F} font-size="10" font-weight="700" fill="${C.fundo}" text-anchor="middle">${ms}</text>`;
      } else {
        svg += `<rect x="${x}" y="${yBarra}" width="${w}" height="26" rx="5" fill="none" stroke="${C.textoSuave}" stroke-width="1.5" stroke-dasharray="3 3"/>`;
        svg += `<text x="${x + w / 2}" y="${yBarra + 18}" ${F} font-size="10" fill="${C.textoSuave}" text-anchor="middle">${ms}</text>`;
      }
      x += w + 6;
    });

    svg += `<line x1="30" y1="${yBarra + 36}" x2="${Math.max(x, 100)}" y2="${yBarra + 36}" stroke="${C.borda}" stroke-width="1"/>`;
    y += 78;
  });

  svg += `
  <rect x="30" y="${y + 8}" width="920" height="70" rx="10" fill="${C.fundoAlt}" stroke="${C.borda}"/>
  <text x="48" y="${y + 34}" ${F} font-size="13" font-weight="700" fill="${C.secundaria}">Legenda</text>
  <rect x="120" y="${y + 20}" width="46" height="18" rx="4" fill="${C.secundaria}"/>
  <text x="176" y="${y + 34}" ${F} font-size="12" fill="${C.textoSuave}">vibração (positivo)</text>
  <rect x="310" y="${y + 20}" width="46" height="18" rx="4" fill="none" stroke="${C.textoSuave}" stroke-dasharray="3 3"/>
  <text x="366" y="${y + 34}" ${F} font-size="12" fill="${C.textoSuave}">silêncio (pausa negativa)</text>
  <text x="48" y="${y + 62}" ${F} font-size="11" fill="${C.textoSuave}">Otimização planejada: substituir as sequências longas por padrões distintos por device, evitando que o usuário precise distinguir vibrações quase idênticas.</text>`;

  svg += rodape('Figura 5. Padrões táteis. A escolha de 6 categorias distintas evita sobreposição de sequências; a lista completa está em js/app.js → obterPadraoVibracao().', W, H);
  svg += `</svg>`;
  fs.writeFileSync(`${IMG}/diag-04-padroes-vibracao.svg`, svg);
  console.log('✓ diag-04-padroes-vibracao.svg');
}

// ============================================================
// DIAGRAMA 5 — Estrutura de pastas
// ============================================================
function diagramaEstrutura() {
  const W = 780, H = 620;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += cabecalho('Estrutura do Repositório', 'Arquivos versionados e sua responsabilidade', W);

  const arquivos = [
    { y: 130, nome: 'app-modulo-iii/', tipo: 'raiz', cor: C.primaria, desc: '' },
    { y: 176, nome: 'index.html', tipo: 'arquivo', cor: C.secundaria, desc: '4 telas + barra inferior + modal (207 linhas)' },
    { y: 216, nome: 'css/', tipo: 'pasta', cor: C.destaque, desc: '' },
    { y: 252, nome: 'css/style.css', tipo: 'arquivo', cor: C.secundaria, desc: 'Design tokens, layout, animações (779 linhas)' },
    { y: 292, nome: 'js/', tipo: 'pasta', cor: C.destaque, desc: '' },
    { y: 328, nome: 'js/app.js', tipo: 'arquivo', cor: C.secundaria, desc: 'Estado, navegação, renderização, simulação (467 linhas)' },
    { y: 368, nome: 'inspecionar.js', tipo: 'script', cor: C.primariaEscura, desc: 'Validação automatizada com Playwright' },
    { y: 408, nome: 'capturar.js', tipo: 'script', cor: C.primariaEscura, desc: 'Geração das capturas da documentação' },
    { y: 448, nome: 'docs/', tipo: 'pasta', cor: C.destaque, desc: '' },
    { y: 484, nome: 'docs/VIBROTATIL-...pdf', tipo: 'doc', cor: C.erro, desc: 'Este documento' },
    { y: 524, nome: 'docs/img/', tipo: 'pasta', cor: C.destaque, desc: '14 capturas + 5 diagramas' },
    { y: 564, nome: 'README.md', tipo: 'doc', cor: C.erro, desc: 'Visão geral do projeto' }
  ];

  arquivos.forEach((a) => {
    const isPasta = a.tipo === 'pasta' || a.tipo === 'raiz';
    svg += `
    <rect x="40" y="${a.y}" width="${isPasta ? 210 : 230}" height="28" rx="6" fill="${C.superficie}" stroke="${a.cor}" stroke-width="1.8"/>
    <text x="52" y="${a.y + 19}" ${F} font-size="12.5" font-weight="${isPasta ? 700 : 500}" fill="${C.texto}">${isPasta ? '📁' : '📄'} ${a.nome}</text>
    ${a.desc ? `<text x="300" y="${a.y + 19}" ${F} font-size="12" fill="${C.textoSuave}">${a.desc}</text>` : ''}`;
  });

  // Hierarquia
  const linhas = [
    [48, 130, 48, 564],
    [48, 216, 60, 216], [48, 292, 60, 292], [48, 448, 60, 448],
    [60, 216, 60, 252], [60, 292, 60, 328], [60, 448, 60, 484], [60, 484, 60, 524]
  ];
  linhas.forEach(([x1, y1, x2, y2]) => {
    svg += `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${C.borda}" stroke-width="1.5" fill="none"/>`;
  });

  svg += `
  <rect x="40" y="${H - 72}" width="700" height="46" rx="8" fill="${C.fundoAlt}" stroke="${C.borda}"/>
  <text x="56" y="${H - 44}" ${F} font-size="12" fill="${C.textoSuave}">
    <tspan font-weight="700" fill="${C.secundaria}">Fora do versionamento:</tspan>
    <tspan> node_modules/ (19 MB), package-lock.json, screenshots de diagnóstico</tspan>
  </text>`;

  svg += rodape('Figura 6. Árvore do repositório. Apenas arquivos-fonte e de documentação são versionados.', W, H);
  svg += `</svg>`;
  fs.writeFileSync(`${IMG}/diag-05-estrutura.svg`, svg);
  console.log('✓ diag-05-estrutura.svg');
}

diagramaArquitetura();
diagramaCiclo();
diagramaNavegacao();
diagramaVibracao();
diagramaEstrutura();
console.log('\n5 diagramas gerados.');
