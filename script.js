const historicoChamadas = [];

  
  function falarVacAdulto() {
  falar("Atenção, para vacinação adulto, tenha em mãos documento com foto");
}

function falarVacInfantil() {
  falar("Atenção, para vacinação infantil, tenha em mãos caderneta de vacinação");
}

function falarRetiradaGuias() {
  falar("Atenção, para retirada de guias, tenha em mãos documento do titular do agendamento");
}

    function voltarAoTopo() {
  const colunas = document.querySelectorAll('.coluna');
  colunas.forEach(coluna => {
    coluna.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function voltarAoFundo() {
  const colunas = document.querySelectorAll('.coluna');
  colunas.forEach(coluna => {
    coluna.scrollTo({ top: coluna.scrollHeight, behavior: 'smooth' });
  });
}


function carregarVozes(callback) {
  const synth = window.speechSynthesis;

  function tentarCarregar() {
    const vozes = synth.getVoices();
    if (vozes.length > 0) {
      callback(vozes);
    } else {
      // Tenta novamente após um curto intervalo
      setTimeout(tentarCarregar, 100);
    }
  }

  tentarCarregar();
}

function falar(texto) {
  const synth = window.speechSynthesis;
  const msg = new SpeechSynthesisUtterance();
  msg.text = texto;
  msg.lang = 'pt-BR';
  msg.rate = 1.2;

  const vozSelecionada = document.getElementById("vozSelecionada")?.value;

  carregarVozes((vozes) => {
    const voz = vozes.find(v => v.name === vozSelecionada);

    if (voz) {
      msg.voice = voz;
      console.log(`✅ Usando voz: ${voz.name}`);
    } else {
      console.warn(`⚠️ Voz "${vozSelecionada}" não encontrada. Usando voz padrão.`);
    }

    synth.speak(msg);
  });
}



    function chamarNome(guiche) {
  const nome = document.getElementById('nomePessoa').value.trim();
  if (nome === '') {
    alert('Por favor, digite um nome.');
    return;
  }

  let mensagem = '';
  let guicheTexto = '';

  if (guiche === 1) {
    mensagem = `Atenção, ${nome}, dirija-se ao guichê 1`;
    guicheTexto = "Guichê 1";
  } else if (guiche === 2) {
    mensagem = `Atenção, ${nome}, dirija-se ao guichê 2`;
    guicheTexto = "Guichê 2";
  } else if (guiche === 3) {
    mensagem = `Atenção, ${nome}, dirija-se ao pós consulta`;
    guicheTexto = "Pós Consulta";
  } else if (guiche === 4) {
    mensagem = `${nome}`;
    guicheTexto = "Leitura em voz alta";
  }

  // Salva no histórico
  const agora = new Date();
  historicoChamadas.push({
    tipo: "Chamada por nome",
    nome: nome,
    guiche: guicheTexto,
    data: agora.toLocaleDateString('pt-BR'),
    hora: agora.toLocaleTimeString('pt-BR'),
  });

  falar(mensagem);
}


   function atualizarUltimaSenhaNormal(texto) {
  const div = document.getElementById('senha-normal');
  if (div) {
    div.textContent = texto;
  }
}

function atualizarUltimaSenhaPreferencial(texto) {
  const div = document.getElementById('senha-preferencial');
  if (div) {
    div.textContent = texto;
  }
}

 // Objeto para armazenar o último botão clicado por coluna
const ultimosBotoesPorColuna = {};
const maioresSenhasPorColuna = {}; // Armazena o maior número clicado por coluna


function criarBotao(idColuna, texto, classe) {
  const coluna = document.getElementById(idColuna);
  const botao = document.createElement('button');
  botao.textContent = texto;
  botao.className = classe;

  const isPreferencial = idColuna.includes("preferencial");

  // Extrai número da senha (ex: "Senha 008 - Guichê 1" => 8)
  const numeroSenha = parseInt(texto.match(/Senha (\d+)/)[1], 10);

  const destino = texto.split(" - ")[1];
  const textoFalado = isPreferencial
    ? `Senha ${numeroSenha}, preferencial, ${destino}`
    : `Senha ${numeroSenha}, normal, ${destino}`;

  botao.onclick = () => {
	  
	  // 🗣️ Fala a senha
    falar(textoFalado);
	
	     // 📝 Salva no histórico
    const agora = new Date();
    historicoChamadas.push({
      tipo: isPreferencial ? "Senha Preferencial" : "Senha Normal",
      senha: texto,
      guiche: destino,
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR'),
    });


    if (isPreferencial) {
      atualizarUltimaSenhaPreferencial(texto);
    } else {
      atualizarUltimaSenhaNormal(texto);
    }

    const botoesNaColuna = Array.from(coluna.querySelectorAll('button'));

    // Atualiza a maior senha chamada na coluna
    if (
      !maioresSenhasPorColuna[idColuna] ||
      numeroSenha > maioresSenhasPorColuna[idColuna]
    ) {
      maioresSenhasPorColuna[idColuna] = numeroSenha;
    }

    const limite = maioresSenhasPorColuna[idColuna];
    const classeDestaque = isPreferencial
      ? 'botao-destacado-preferencial'
      : 'botao-destacado-normal';

    // Limpa destaques anteriores
    botoesNaColuna.forEach(btn => {
      btn.classList.remove('botao-destacado-normal', 'botao-destacado-preferencial');
    });

    // Destaca todos até o maior número
    botoesNaColuna.forEach(btn => {
      const match = btn.textContent.match(/Senha (\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num <= limite) {
          btn.classList.add(classeDestaque);
        }
      }
    });
	
	// Após marcar a própria coluna, sincroniza com a correspondente
const colunaSincronizadaID = obterColunaSincronizada(idColuna);
if (colunaSincronizadaID) {
  const colunaOutro = document.getElementById(colunaSincronizadaID);
  if (colunaOutro) {
    const botoesOutro = Array.from(colunaOutro.querySelectorAll('button'));
    botoesOutro.forEach(btn => {
      const match = btn.textContent.match(/Senha (\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num <= limite) {
          btn.classList.add(classeDestaque);
          // ✅ Se for o número exato, dá scroll
          if (num === numeroSenha) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    });
  }
}

	 // 👉 Centraliza visualmente a senha chamada
  botao.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // ✅ Salva como última senha chamada
  ultimaSenhaChamada = botao;

  
  };

  coluna.appendChild(botao);

}

function obterColunaSincronizada(idColuna) {
  if (idColuna === 'coluna-normal-guiche1') return 'coluna-normal-guiche2';
  if (idColuna === 'coluna-normal-guiche2') return 'coluna-normal-guiche1';
  if (idColuna === 'coluna-preferencial-guiche1') return 'coluna-preferencial-guiche2';
  if (idColuna === 'coluna-preferencial-guiche2') return 'coluna-preferencial-guiche1';
  return null; // Pós Consulta não sincroniza
}


    // Criar senhas normais
    for (let i = 1; i <= 999; i++) {
      const numero = i.toString().padStart(1, '0');
      criarBotao("coluna-normal-guiche1", `Senha ${numero} - Guichê 1`, 'botao-preto');
      criarBotao("coluna-normal-guiche2", `Senha ${numero} - Guichê 2`, 'botao-preto');
      criarBotao("coluna-normal-posconsulta", `Senha ${numero} - Pós Consulta`, 'botao-preto');
    }

    // Criar senhas preferenciais
    for (let i = 1; i <= 999; i++) {
      const numero = i.toString().padStart(1, '0');
      criarBotao("coluna-preferencial-guiche1", `Senha ${numero} - Guichê 1`, 'botao-vermelho');
      criarBotao("coluna-preferencial-guiche2", `Senha ${numero} - Guichê 2`, 'botao-vermelho');
      criarBotao("coluna-preferencial-posconsulta", `Senha ${numero} - Pós Consulta`, 'botao-vermelho');
    }
	
function exportarChamadasCSV() {
  if (historicoChamadas.length === 0) {
    alert("Nenhuma chamada registrada.");
    return;
  }

  let csv = "Tipo,Nome/Senha,Guichê,Data,Hora\n";

  historicoChamadas.forEach(registro => {
    const linha = [
      registro.tipo,
      registro.nome || registro.senha || "",
      registro.guiche,
      registro.data,
      registro.hora
    ].map(campo => `"${campo}"`).join(",");
    csv += linha + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "historico_chamadas.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function atualizarControlesGuiche() {
  const guiche1 = document.getElementById("check-guiche1").checked;
  const guiche2 = document.getElementById("check-guiche2").checked;
  const posConsulta = document.getElementById("check-posconsulta").checked;

  // Estado inicial
  let habilitarGuiche1 = false;
  let habilitarGuiche2 = false;
  let habilitarPosConsulta = false;

  // Lógica de habilitação com base nas combinações
  if (guiche1 && guiche2 && posConsulta) {
    habilitarGuiche1 = habilitarGuiche2 = habilitarPosConsulta = true;
  } else if (guiche1 && guiche2) {
    habilitarGuiche1 = habilitarGuiche2 = true;
  } else if (guiche1 && posConsulta) {
    habilitarGuiche1 = habilitarPosConsulta = true;
  } else if (guiche2 && posConsulta) {
    habilitarGuiche2 = habilitarPosConsulta = true;
  } else if (guiche1) {
    habilitarGuiche1 = true;
  } else if (guiche2) {
    habilitarGuiche2 = true;
  } else if (posConsulta) {
    habilitarPosConsulta = true;
  }

  // Botões principais
  document.querySelector('button.botao-amarelo').disabled = !habilitarGuiche1;
  document.querySelector('button.botao-verde').disabled = !habilitarGuiche2;
  document.querySelector('button.botao-lilas').disabled = !habilitarPosConsulta;

  // Colunas
  toggleColunaBotoes("coluna-normal-guiche1", habilitarGuiche1);
  toggleColunaBotoes("coluna-preferencial-guiche1", habilitarGuiche1);

  toggleColunaBotoes("coluna-normal-guiche2", habilitarGuiche2);
  toggleColunaBotoes("coluna-preferencial-guiche2", habilitarGuiche2);

  toggleColunaBotoes("coluna-normal-posconsulta", habilitarPosConsulta);
  toggleColunaBotoes("coluna-preferencial-posconsulta", habilitarPosConsulta);
}

function toggleColunaBotoes(idColuna, habilitar) {
  const coluna = document.getElementById(idColuna);
  if (coluna) {
    const botoes = coluna.querySelectorAll("button");
    botoes.forEach(btn => {
      btn.disabled = !habilitar;
      btn.classList.toggle('desabilitado', !habilitar); // Visualmente mais claro
    });
  }
}


window.speechSynthesis.onvoiceschanged = () => {
  carregarVozes(() => {});
};

document.addEventListener("DOMContentLoaded", function () {
  forcarSelecaoGuiche();
});

function forcarSelecaoGuiche() {
  const check1 = document.getElementById("check-guiche1");
  const check2 = document.getElementById("check-guiche2");
  const check3 = document.getElementById("check-posconsulta");

  function nenhumSelecionado() {
    return !check1.checked && !check2.checked && !check3.checked;
  }

  // Mostra alerta até que um seja selecionado
  if (nenhumSelecionado()) {
    setTimeout(() => {
      alert("⚠️ Por favor, selecione um guichê (Guichê 1, Guichê 2 ou Pós Consulta) antes de continuar.");
    }, 300);

    // Desabilita tudo enquanto nenhum está selecionado
    atualizarControlesGuiche();
  }

  // Observa mudanças
  check1.addEventListener("change", () => {
    if (!nenhumSelecionado()) atualizarControlesGuiche();
  });
  check2.addEventListener("change", () => {
    if (!nenhumSelecionado()) atualizarControlesGuiche();
  });
  check3.addEventListener("change", () => {
    if (!nenhumSelecionado()) atualizarControlesGuiche();
  });
}

// ... Todas as suas funções anteriores, incluindo toggleColunaBotoes e atualizarControlesGuiche ...

// Adiciona os event listeners aos checkboxes
document.getElementById("check-guiche1").addEventListener("change", atualizarControlesGuiche);
document.getElementById("check-guiche2").addEventListener("change", atualizarControlesGuiche);
document.getElementById("check-posconsulta").addEventListener("change", atualizarControlesGuiche);

// Executa a lógica ao carregar a página
window.addEventListener("DOMContentLoaded", atualizarControlesGuiche);

let ultimaSenhaChamada = null;

document.addEventListener("keydown", function (event) {
  const tecla = event.key.toLowerCase();
  const inputNome = document.getElementById("nomePessoa");

  // Impede atalhos se o foco estiver no input de nome
  if (document.activeElement === inputNome) {
    return;
  }

  if (tecla === 'r') {
     repetirUltimaSenha();
  }
});


function chamarProximaSenha(tipo) {
  const colunas = {
    preferencial: [
      "coluna-preferencial-guiche1",
      "coluna-preferencial-guiche2",
      "coluna-preferencial-posconsulta"
    ],
    normal: [
      "coluna-normal-guiche1",
      "coluna-normal-guiche2",
      "coluna-normal-posconsulta"
    ]
  };

  for (const idColuna of colunas[tipo]) {
    const coluna = document.getElementById(idColuna);
    if (!coluna) continue;

    const botoes = Array.from(coluna.querySelectorAll('button')).filter(btn => !btn.disabled);
    for (const btn of botoes) {
      if (!btn.classList.contains('botao-destacado-normal') && 
          !btn.classList.contains('botao-destacado-preferencial')) {

        btn.click(); // Chama a senha (já integra voz, cor, histórico)
        ultimaSenhaChamada = btn; // Guarda referência
        return;
      }
    }
  }

  alert(`Todas as senhas ${tipo === 'preferencial' ? 'preferenciais' : 'normais'} já foram chamadas.`);
}

function repetirUltimaSenha() {
  if (ultimaSenhaChamada) {
    ultimaSenhaChamada.click();
  } else {
    alert("Nenhuma senha foi chamada ainda.");
  }
}


	
 