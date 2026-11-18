// ============================================================
// VIBROTÁTIL Connect, App móvel (Módulo III), protótipo de interface
// Simula a identificação de sons pelo smartphone, feedback visual
// e vibração do aparelho. Não usa microfone real, Bluetooth nem IA.
// ============================================================

// Dados simulados
const DISPOSITIVOS_APP = [
  { id: 'wrist', nome: 'VIBROTÁTIL Wrist', icone: '⌚', conectado: true },
  { id: 'chest', nome: 'VIBROTÁTIL Chest', icone: '🫀', conectado: false },
  { id: 'bone', nome: 'VIBROTÁTIL Bone', icone: '🦻', conectado: false }
];

const SONS_SIMULADOS = [
  { id: 'campainha', label: 'Campainha', icone: '🔔', dispositivo: 'wrist', padrao: 'Pulso longo + 2 curtos' },
  { id: 'buzina', label: 'Buzina', icone: '🚗', dispositivo: 'wrist', padrao: '2 pulsos rápidos' },
  { id: 'choro', label: 'Choro de bebê', icone: '👶', dispositivo: 'chest', padrao: '3 pulsos longos' },
  { id: 'alarme', label: 'Alarme', icone: '🚨', dispositivo: 'wrist', padrao: 'Sequência rápida repetitiva' },
  { id: 'chamada', label: 'Chamada', icone: '📞', dispositivo: 'wrist', padrao: 'Vibração contínua curta' },
  { id: 'voz', label: 'Voz humana', icone: '🗣️', dispositivo: 'bone', padrao: 'Padrão de fala (Bone)' }
];

const PERFIS_INICIAIS = [
  { id: 'casa', nome: 'Casa', ativo: true },
  { id: 'rua', nome: 'Rua', ativo: false },
  { id: 'trabalho', nome: 'Trabalho', ativo: false },
  { id: 'noite', nome: 'Noite', ativo: false }
];

// Estado da aplicação
const estado = {
  escutando: false,
  perfis: [],
  historico: [],
  // Modo escuro é o padrão; o usuário só altera via toggle em Ajustes
  tema: localStorage.getItem('vibrotatil-tema') || 'escuro',
  vibracaoAtiva: true,
  visualAtiva: true,
  dispositivos: JSON.parse(JSON.stringify(DISPOSITIVOS_APP))
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Perfis iniciais (apenas se ainda não houver)
  if (estado.perfis.length === 0) {
    estado.perfis = JSON.parse(JSON.stringify(PERFIS_INICIAIS));
  }

  aplicarTemaSalvo();
  renderBotoesAtalho();
  renderListaPerfis();
  renderHistorico();
  vincularNavegacao();
  vincularControles();
  vincularOuvir();
});

// ------------------------------------------------------------
// Navegação entre telas (bar inferior + botões voltar)
// ------------------------------------------------------------
function vincularNavegacao() {
  document.body.addEventListener('click', (evento) => {
    const alvo = evento.target.closest('[data-ir-para]');
    if (!alvo) return;

    evento.preventDefault();
    const destino = alvo.dataset.irPara;
    irParaTela(destino);
  });
}

function irParaTela(idTela) {
  document.querySelectorAll('.tela').forEach((t) => t.classList.remove('ativa'));
  document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('ativo'));

  // Fecha o modal de perfil caso esteja aberto (evita tela bloqueada)
  const modal = document.getElementById('modal-perfil');
  const overlay = document.getElementById('overlay-modal');
  if (modal) modal.style.display = 'none';
  if (overlay) overlay.style.display = 'none';

  // Aceita tanto "historico" quanto "tela-historico"
  const tela = document.getElementById(idTela) || document.getElementById(`tela-${idTela}`);
  if (tela) {
    tela.classList.add('ativa');
  } else {
    console.warn(`Tela não encontrada: ${idTela}`);
  }

  const itemNav = document.querySelector(`.nav-item[data-ir-para="${idTela}"]`);
  if (itemNav) itemNav.classList.add('ativo');

  if (idTela === 'historico') renderHistorico();
  if (idTela === 'perfis') renderListaPerfis();
}

// ------------------------------------------------------------
// Botão principal "Ouvir ambiente" (simulado)
// ------------------------------------------------------------
function vincularOuvir() {
  const btn = document.getElementById('btn-ouvir');
  const textoBtn = document.getElementById('texto-btn-ouvir');
  const bolinha = document.getElementById('bolinha-microfone');
  const textoMicrofone = document.getElementById('texto-microfone');
  const circuito = document.getElementById('circuito-visual');

  btn.addEventListener('click', () => {
    if (estado.escutando) {
      pararEscuta();
      return;
    }
    iniciarEscuta();
  });

  function iniciarEscuta() {
    estado.escutando = true;

    btn.classList.add('ativo');
    textoBtn.textContent = 'Ouvindo...';
    circuito.classList.add('escutando');
    if (bolinha) {
      bolinha.classList.add('ativo');
      bolinha.style.background = 'var(--cor-sucesso)';
    }
    if (textoMicrofone) textoMicrofone.textContent = 'Microfone ativo';

    // Simula detecção aleatória entre 2s e 5s
    const tempo = 2000 + Math.random() * 3000;
    setTimeout(() => {
      if (!estado.escutando) return;
      detectarSomSimulado();
    }, tempo);
  }

  function pararEscuta() {
    estado.escutando = false;

    btn.classList.remove('ativo');
    textoBtn.textContent = 'Ouvir ambiente';
    circuito.classList.remove('escutando');
    if (bolinha) {
      bolinha.classList.remove('ativo');
      bolinha.style.background = 'var(--cor-texto-suave)';
    }
    if (textoMicrofone) textoMicrofone.textContent = 'Microfone parado';
  }
}

// ------------------------------------------------------------
// Simulação de detecção de som
// ------------------------------------------------------------
function detectarSomSimulado() {
  const som = SONS_SIMULADOS[Math.floor(Math.random() * SONS_SIMULADOS.length)];

  const iconeResultado = document.getElementById('icone-resultado');
  const textoResultado = document.getElementById('texto-resultado');
  const subtextoResultado = document.getElementById('subtexto-resultado');

  if (iconeResultado) iconeResultado.textContent = som.icone;
  if (textoResultado) textoResultado.textContent = som.label;
  if (subtextoResultado) subtextoResultado.textContent = `Enviado para ${som.dispositivo.toUpperCase()}`;

  animarAlertaNaTela(som.dispositivo);

  if (estado.vibracaoAtiva && navigator.vibrate) {
    navigator.vibrate(obterPadraoVibracao(som.id));
  }

  const registro = {
    id: 'evt-' + Date.now(),
    label: som.label,
    icone: som.icone,
    dispositivo: som.dispositivo,
    horario: new Date().toISOString()
  };
  estado.historico.unshift(registro);
  if (estado.historico.length > 100) estado.historico.length = 100;
  localStorage.setItem('vibrotatil-historico', JSON.stringify(estado.historico));

  renderHistorico();
  mostrarToast(`${som.icone} ${som.label} detectado`, 'info', 3000);

  if (estado.escutando) {
    setTimeout(() => {
      if (estado.escutando) detectarSomSimulado();
    }, 5000);
  }
}

function obterPadraoVibracao(idSom) {
  const padroes = {
    campainha: [400, 200, 200, 200],
    buzina: [300, 150, 300],
    choro: [600, 200, 600, 200, 600],
    alarme: [200, 100, 200, 100, 200, 100, 200],
    chamada: [500, 300, 500],
    voz: [300, 150, 300, 150, 300]
  };
  return padroes[idSom] || [400];
}

function animarAlertaNaTela(idDispositivo) {
  const btn = document.querySelector(`.btn-atalho[data-dispositivo="${idDispositivo}"]`);
  if (btn) {
    btn.classList.add('detectado');
    setTimeout(() => btn.classList.remove('detectado'), 900);
  }
}

// ------------------------------------------------------------
// Renderização dos atalhos rápidos (tela principal)
// ------------------------------------------------------------
function renderBotoesAtalho() {
  const grade = document.getElementById('grade-atalhos');
  if (!grade) return;

  grade.innerHTML = '';

  SONS_SIMULADOS.forEach((som) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-atalho';
    btn.dataset.dispositivo = som.dispositivo;

    btn.innerHTML = `
      <span class="icone">${som.icone}</span>
      <span>${som.label}<br><span style="font-weight:500;">${som.dispositivo.toUpperCase()}</span></span>
    `;

    btn.addEventListener('click', () => {
      detectarSomEspecifico(som);
    });

    grade.appendChild(btn);
  });
}

function detectarSomEspecifico(som) {
  const iconeResultado = document.getElementById('icone-resultado');
  const textoResultado = document.getElementById('texto-resultado');
  const subtextoResultado = document.getElementById('subtexto-resultado');

  if (iconeResultado) iconeResultado.textContent = som.icone;
  if (textoResultado) textoResultado.textContent = som.label;
  if (subtextoResultado) subtextoResultado.textContent = `Simulado → ${som.dispositivo.toUpperCase()}`;

  animarAlertaNaTela(som.dispositivo);

  if (estado.vibracaoAtiva && navigator.vibrate) {
    navigator.vibrate(obterPadraoVibracao(som.id));
  }

  const registro = {
    id: 'evt-' + Date.now(),
    label: som.label,
    icone: som.icone,
    dispositivo: som.dispositivo,
    horario: new Date().toISOString()
  };
  estado.historico.unshift(registro);
  if (estado.historico.length > 100) estado.historico.length = 100;
  localStorage.setItem('vibrotatil-historico', JSON.stringify(estado.historico));

  renderHistorico();
  mostrarToast(`${som.icone} ${som.label} detectado`, 'info', 2500);
}

// ------------------------------------------------------------
// Renderização do histórico
// ------------------------------------------------------------
function renderHistorico() {
  const vazio = document.getElementById('historico-vazio');
  const lista = document.getElementById('lista-historico');

  if (!vazio || !lista) return;

  if (estado.historico.length === 0) {
    vazio.style.display = 'flex';
    lista.style.display = 'none';
    return;
  }

  vazio.style.display = 'none';
  lista.style.display = 'flex';

  lista.innerHTML = '';

  estado.historico.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'item-historico';
    el.innerHTML = `
      <div class="icone">${item.icone}</div>
      <div class="detalhes">
        <span class="nome-evento">${item.label}</span>
        <span class="dispositivo">${item.dispositivo.toUpperCase()}</span>
      </div>
      <div class="horario">${formatarHora(item.horario)}</div>
    `;
    lista.appendChild(el);
  });
}

function formatarHora(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ------------------------------------------------------------
// Perfis
// ------------------------------------------------------------
function renderListaPerfis() {
  const lista = document.getElementById('lista-perfis');
  if (!lista) return;

  lista.innerHTML = '';

  estado.perfis.forEach((perfil) => {
    const el = document.createElement('div');
    el.className = `item-perfil ${perfil.ativo ? 'ativo' : ''}`;
    el.innerHTML = `
      <div>
        <div class="nome">${perfil.nome}</div>
      </div>
      <div class="sinal">${perfil.ativo ? '✓' : '○'}</div>
    `;

    el.addEventListener('click', () => {
      estado.perfis.forEach((p) => (p.ativo = false));
      perfil.ativo = true;
      renderListaPerfis();
      mostrarToast(`Perfil "${perfil.nome}" ativado`, 'sucesso', 2000);
    });

    lista.appendChild(el);
  });

  // Modal novo perfil
  const btnNovo = document.getElementById('btn-novo-perfil');
  const btnFechar = document.getElementById('btn-fechar-modal-perfil');
  const btnCancelar = document.getElementById('btn-cancelar-perfil');
  const btnSalvar = document.getElementById('btn-salvar-perfil');
  const inputNome = document.getElementById('nome-perfil');
  const modal = document.getElementById('modal-perfil');
  const overlay = document.getElementById('overlay-modal');

  if (btnNovo) {
    btnNovo.onclick = () => {
      modal.style.display = 'block';
      overlay.style.display = 'block';
      inputNome.value = '';
      inputNome.focus();
    };
  }

  const fecharModal = () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  };

  if (btnFechar) btnFechar.onclick = fecharModal;
  if (btnCancelar) btnCancelar.onclick = fecharModal;
  if (overlay) overlay.onclick = fecharModal;

  if (btnSalvar) {
    btnSalvar.onclick = () => {
      const nome = inputNome.value.trim();
      if (!nome) {
        mostrarToast('Informe um nome para o perfil', 'erro', 2000);
        return;
      }

      const novo = {
        id: 'perfil-' + Date.now(),
        nome,
        ativo: false
      };
      estado.perfis.push(novo);
      renderListaPerfis();
      fecharModal();
      mostrarToast(`Perfil "${nome}" criado`, 'sucesso', 2000);
    };
  }
}

// ------------------------------------------------------------
// Controles de acessibilidade e configurações
// ------------------------------------------------------------
function vincularControles() {
  // Tema
  const btnTema = document.getElementById('toggle-tema');
  if (btnTema) {
    btnTema.checked = estado.tema === 'escuro';
    btnTema.addEventListener('change', () => {
      estado.tema = btnTema.checked ? 'escuro' : 'claro';
      localStorage.setItem('vibrotatil-tema', estado.tema);
      aplicarTemaSalvo();
    });
  }

  // Vibração
  const btnVibracao = document.getElementById('toggle-vibracao');
  if (btnVibracao) {
    btnVibracao.checked = estado.vibracaoAtiva;
    btnVibracao.addEventListener('change', () => {
      estado.vibracaoAtiva = btnVibracao.checked;
    });
  }

  // Visual
  const btnVisual = document.getElementById('toggle-visual');
  if (btnVisual) {
    btnVisual.checked = estado.visualAtiva;
    btnVisual.addEventListener('change', () => {
      estado.visualAtiva = btnVisual.checked;
    });
  }

  // Dispositivos conectados
  ['wrist', 'chest', 'bone'].forEach((id) => {
    const el = document.getElementById(`toggle-${id}`);
    if (el) {
      const disp = estado.dispositivos.find((d) => d.id === id);
      el.checked = disp ? disp.conectado : false;
      el.addEventListener('change', () => {
        if (disp) disp.conectado = el.checked;
        mostrarToast(`${disp.nome} ${el.checked ? 'conectado' : 'desconectado'}`, 'info', 2000);
      });
    }
  });
}

// ------------------------------------------------------------
// Tema
// ------------------------------------------------------------
function aplicarTemaSalvo() {
  document.documentElement.setAttribute('data-tema', estado.tema);

  // Mantém a barra de status do navegador/mobile sincronizada com o tema
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', estado.tema === 'escuro' ? '#0b1220' : '#f4f7fa');
  }

  const btnTema = document.getElementById('toggle-tema');
  if (btnTema) btnTema.checked = estado.tema === 'escuro';
}

// ------------------------------------------------------------
// Toast
// ------------------------------------------------------------
function mostrarToast(mensagem, tipo = 'info', duracao = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = mensagem;
  toast.className = `toast toast-${tipo} visivel`;

  setTimeout(() => {
    toast.classList.remove('visivel');
  }, duracao);
}

// Expor para debug no console (opcional)
window.VIBROTATIL_APP = {
  estado,
  irParaTela,
  mostrarToast
};
