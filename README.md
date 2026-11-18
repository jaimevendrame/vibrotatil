# VIBROTÁTIL® Connect — App Módulo III

Protótipo simulado da interface do aplicativo móvel do **Módulo III** do projeto VIBROTÁTIL®, desenvolvido pela G-TEC do Brasil S.A.

## 📄 Documentação técnica

**[VIBROTÁTIL-Connect-Modulo-III.pdf](docs/VIBROTATIL-Connect-Modulo-III.pdf)** — documento técnico completo (42 páginas) com:

- screenshots de todas as funcionalidades;
- 5 diagramas de arquitetura, fluxo de detecção, navegação, padrões vibratórios e estrutura do repositório;
- documentação detalhada das 7 funcionalidades, com comportamento, dados envolvidos e requisitos para a versão real;
- base técnica (design tokens, persistência, decisões de engenharia);
- resultados da validação automatizada;
- roadmap do protótipo até a versão funcional, com riscos e severidade.

## O que é

Aplicativo de celular que simula a **identificação de sons** do ambiente, convertendo-os em:

- **Sinalização visual** na tela (ícone + nome do evento detectado)
- **Sinalização tátil** via vibração do próprio smartphone (`navigator.vibrate`), com padrões distintos por tipo de som
- **Registro no histórico** de alertas

## Escopo do protótipo

Este repositório contém **apenas a camada de interface**. Não implementa:

- captura real de áudio do microfone
- processamento digital de sinais (DSP / FFT)
- inteligência artificial para classificação de sons
- conexão Bluetooth com os dispositivos físicos (Bone, Chest, Wrist)

Todos os sons e dispositivos são simulados com dados fictícios, apenas para validação de fluxos, navegação e experiência do usuário.

## Telas

| Tela | Função |
| --- | --- |
| **Início** | Scanner de ambiente com botão "Ouvir ambiente", resultado da detecção e atalhos rápidos por tipo de som |
| **Histórico** | Registro dos alertas detectados (persistido em `localStorage`) |
| **Perfis** | Perfis de contexto (Casa, Rua, Trabalho, Noite) + criação de novos |
| **Ajustes** | Vibração, sinalização visual, tema claro/escuro e dispositivos conectados |

## Como executar localmente

Abra `index.html` diretamente no navegador — não requer servidor nem build.

```bash
# opcional: servir via HTTP
npx serve .
```

## Validação automatizada

O projeto inclui um script de verificação com Playwright que checa navegação, renderização, detecção simulada, modal, tema e ausência de erros de console.

```bash
npm install
npx playwright install chromium
node inspecionar.js
```

## Publicação

Hospedado via **GitHub Pages**.

## Geração da documentação

```bash
node capturar.js          # gera as capturas em docs/img/
node gerar-diagramas.js   # gera os 5 diagramas SVG
node svg-para-png.js      # converte os diagramas para PNG
node docs/gerar-pdf.js    # gera o PDF final
```

---

© 2026 G-TEC do Brasil S.A. Todos os direitos reservados.
