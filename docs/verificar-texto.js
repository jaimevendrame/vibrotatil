// Varredura de marcadores de texto gerado por IA (AI slop) nos documentos do projeto
const fs = require('fs');

const ARQUIVOS = [
  'docs/documento.html',
  'README.md',
  'js/app.js',
  'capturar.js',
  'gerar-diagramas.js',
  'inspecionar.js',
  'docs/gerar-pdf.js'
];

const PADROES = [
  [/\bn[ãa]o apenas\b[^.]{0,80}\bmas\b/gi, 'falsa-antitese "nao apenas...mas"'],
  [/\bn[ãa]o s[óo]\b[^.]{0,60}\bmas tamb[ée]m\b/gi, '"nao so...mas tambem"'],
  [/desempenha um papel\b/gi, '"desempenha um papel"'],
  [/\bdesempenha papel\b/gi, '"desempenha papel"'],
  [/vale a pena (destacar|mencionar|lembrar)/gi, '"vale a pena destacar"'],
  [/é importante (destacar|notar|lembrar)/gi, '"e importante notar"'],
  [/^Em resumo,/gim, '"Em resumo,"'],
  [/\bEm resumo,\b/gi, '"Em resumo,"'],
  [/\bVale destacar\b/gi, '"Vale destacar"'],
  [/\bfundamental para\b/gi, '"fundamental para"'],
  [/\bessencial para\b/gi, '"essencial para"'],
  [/\bé fundamental\b/gi, '"e fundamental"'],
  [/\bcrucial\b/gi, '"crucial"'],
  [/\bpivotal\b/gi, '"pivotal"'],
  [/\bparadigma\b/gi, '"paradigma"'],
  [/\brobust[oa]\b/gi, '"robusto"'],
  [/\bseamless\b/gi, '"seamless"'],
  [/\bleverage\b/gi, '"leverage"'],
  [/\bcomprehensive\b/gi, '"comprehensive"'],
  [/\bchamp\b/gi, '"champ"'],
  [/\bfurthermore\b/gi, '"furthermore"'],
  [/\bmoreover\b/gi, '"moreover"'],
  [/totalmente\s+\w+/gi, '"totalmente"'],
  [/completamente\s+\w+/gi, '"completamente"'],
  [/absolutamente\s+\w+/gi, '"absolutamente"'],
  [/\bverdadeiramente\b/gi, '"verdadeiramente"'],
  [/entrando em (detalhe|detalhes)/gi, '"entrando em detalhes"'],
  [/vale mencionar/gi, '"vale mencionar"'],
  [/é notável/gi, '"e notavel"'],
  [/em última instância/gi, '"em ultima instancia"'],
  [/sem precedentes/gi, '"sem precedentes"'],
  [/revolucion[áa]ri/gi, '"revolucionario"'],
  [/transformador|transforma o|transformam o/gi, '"transformador"'],
  [/redefine/gi, '"redefine"'],
  [/revolucionando/gi, '"revolucionando"'],
  [/o futuro (é|está|será) (aqui|agora|chegou)/gi, '"o futuro chegou"'],
  [/um novo (paradigma|era|olhar)/gi, '"um novo paradigma"'],
  [/jornada\b/gi, '"jornada"'],
  [/criar valor/gi, '"criar valor"'],
  [/impacto significativo/gi, '"impacto significativo"'],
  [/solução inovadora/gi, '"solucao inovadora"'],
  [/abrir (novas )?possibilidades/gi, '"abrir possibilidades"'],
  [/uma nova (forma|maneira) de\b/gi, '"uma nova forma de"'],
  [/experiência (do usuário|de uso) (imersiva|intuitiva|seamless|fluida)/gi, '"experiencia marcante"'],
  [/simples e (intuitivo|eficaz|elegante)/gi, '"simples e intuitivo"'],
  [/fácil de usar/gi, '"facil de usar"'],
  [/\bnão requer\b|\bnão exige\b(?! reescrita)/gi, '"nao requer/exige"'],
  [/apenas (um|uma) (clique|passo|poucas)/gi, '"apenas um clique"'],
  [/um (passo|clique) (simples|rápido|fácil)/gi, '"um passo simples"'],
  [/\balavancando\b|\balavançando\b/gi, '"alavancando"'],
  [/\bpotencializ\w+/gi, '"potencializando"'],
  [/\bdestinando\b/gi, '"destinando"'],
  // --- padrões adicionais ---
  [/em suma\b/gi, '"em suma"'],
  [/em poucas palavras/gi, '"em poucas palavras"'],
  [/vale a pena (ressaltar|lembrar|reforçar)/gi, '"vale a pena reforçar"'],
  [/não é exagero dizer/gi, '"nao e exagero"'],
  [/em termos (simples|práticos|gerais)/gi, '"em termos simples"'],
  [/a título de (exemplo|introdução)/gi, '"a titulo de exemplo"'],
  [/no que diz respeito a/gi, '"no que diz respeito a"'],
  [/desempenha (um|papel) (papel|função|central|decisiv)/gi, '"desempenha papel"'],
  [/pode-se (dizer|afirmar|considerar)/gi, '"pode-se dizer"'],
  [/é possível notar que/gi, '"e possivel notar"'],
  [/não se pode (deixar de) (negar|ignorar)/gi, '"nao se pode negar"'],
  [/enfatiza(do|ndo| a)?/gi, '"enfatiza"'],
  [/busca-se (atingir|garantir|proporcionar)/gi, '"busca-se"'],
  [/visa (garantir|assegurar|oferecer)/gi, '"visa garantir"'],
  [/tem como objetivo/gi, '"tem como objetivo"'],
  [/desempenha um papel (vital|decisivo|indispensável)/gi, '"papel vital"'],
  [/uma abordagem (moderna|inovadora|innovadora)/gi, '"abordagem moderna"'],
  [/como o nome (sugere|diz|indica)/gi, '"como o nome sugere"'],
  [/vale (a pena )?registrar/gi, '"vale registrar"'],
  [/\bmais do que (apenas|só|simplesmente)/gi, '"mais do que apenas"'],
  [/\bem (um|uma) (destaque|marco) (importante|significativo|relevante)/gi, '"em um destaque importante"'],
  [/não (é|e) (só|apenas|meramente)/gi, '"nao e apenas"'],
  [/\bfundamental\b/gi, '"fundamental"'],
  [/\bexcelente\b/gi, '"excelente"'],
  [/\bperfeito\b/gi, '"perfeito"'],
  [/\bincrível\b/gi, '"incrivel"'],
  [/\bimpressionante\b/gi, '"impressionante"'],
  [/\bdisruptiv\w+/gi, '"disruptivo"'],
  [/\binovador\b/gi, '"inovador"'],
  [/\btransformador\b/gi, '"transformador"'],
  [/\.\.\./g, 'reticencias'],
  [/\bque é (bastante|muito|extremamente) /gi, '"que e muito"'],
  [/\bnão só (mais|apenas)\b/gi, '"nao so mais"'],
  [/\bde forma (totalmente|completamente) /gi, '"de forma totalmente"'],
  [/\bcom o objetivo de (garantir|proporcionar|oferecer|assegurar|entregar|melhorar)/gi, '"com o objetivo de..."'],
  [/\bde acordo com as (necessidades|exigências) (do|de) /gi, '"de acordo com as necessidades"'],
  [/\bcom o foco em\b/gi, '"com o foco em"'],
  [/\bem suma\b/gi, '"em soma"'],
  [/\bfazendo uso de\b/gi, '"fazendo uso de"'],
  [/\bnão carece de\b/gi, '"nao carece de"'],
];

// travessões: separar usos legítimos de usos decorativos
const USO_EMPRESA = /—\s*(G-TEC|branch|VIBROTÁTIL|Protótipo|Módulo|emissão|CNPJ|W3C|navegador)/;
const LINGUAGEM_CODIGO = /^\s*(\/\/|\/\*|\*|<pre|<code)/;
// reticências: em prosa são sinal de truncamento; em código são spread operator ou texto de UI
const RETICENCIAS_PROSA = /\.\.\.(?=\s+[a-zà-ÿ]{3,})/;

let totalProblemas = 0;

for (const arquivo of ARQUIVOS) {
  if (!fs.existsSync(arquivo)) continue;
  const bruto = fs.readFileSync(arquivo, 'utf8');
  const linhas = bruto.split('\n');
  const problemas = [];

  // marcadores de slop
  const texto = bruto.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  for (const [re, nome] of PADROES) {
    let m;
    if (nome === 'reticencias') {
      // só conta reticências que precedem palavras (truncamento em prosa)
      m = texto.match(RETICENCIAS_PROSA);
      if (!m) continue;
    } else {
      m = texto.match(re);
      if (!m) continue;
    }
    problemas.push({
      tipo: 'SLOP',
      nome,
      total: m.length,
      exemplos: [...new Set(m.map((s) => s.trim()))].slice(0, 3)
    });
  }

  // travessões decorativos (fora de contexto legítimo)
  let travDecorativo = 0;
  const exemplosTrav = [];
  linhas.forEach((l, i) => {
    if (!l.includes('—')) return;
    const q = l.replace(/<[^>]+>/g, '').trim();
    if (!q) return;
    if (LINGUAGEM_CODIGO.test(l)) return;
    if (USO_EMPRESA.test(q)) return;
    // travessão como parêntese: "X — descrição" ou "— continuação"
    travDecorativo++;
    if (exemplosTrav.length < 4) exemplosTrav.push(`L${i + 1}: ${q.substring(0, 110)}`);
  });

  if (travDecorativo > 0) {
    problemas.push({
      tipo: 'TRAVESSÃO',
      nome: 'travessão decorativo (como parêntese)',
      total: travDecorativo,
      exemplos: exemplosTrav
    });
  }

  if (problemas.length) {
    console.log(`\n===== ${arquivo} =====`);
    problemas.forEach((p) => {
      totalProblemas += p.total;
      console.log(`  [${p.tipo}] ${p.nome}: ${p.total}`);
      p.exemplos.forEach((e) => console.log(`      · ${e}`));
    });
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Total de ocorrências a revisar: ${totalProblemas}`);
