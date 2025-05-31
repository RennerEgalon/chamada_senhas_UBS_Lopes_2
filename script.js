const historicoChamadas = [];

const contadorLocal = {
  normal: 0,
  preferencial: 0
};

// Novo objeto para rastrear última senha chamada por coluna
const ultimasSenhasChamadas = {
  'coluna-normal-guiche1': 0,
  'coluna-normal-guiche2': 0,
  'coluna-preferencial-guiche1': 0,
  'coluna-preferencial-guiche2': 0
};

function criarBotao(idColuna, texto, classe) {
  const coluna = document.getElementById(idColuna);
  const botao = document.createElement('button');
  botao.textContent = texto;
  botao.className = classe;

  const isPreferencial = idColuna.includes("preferencial");
  const numeroSenha = parseInt(texto.match(/Senha (\d+)/)[1], 10);
  const destino = texto.split(" - ")[1];
  const textoFalado = isPreferencial
    ? `Senha ${numeroSenha}, preferencial, ${destino}`
    : `Senha ${numeroSenha}, normal, ${destino}`;

  botao.onclick = () => {
    // Atualiza a última senha chamada na coluna
    ultimasSenhasChamadas[idColuna] = numeroSenha;

    falar(textoFalado);

    const agora = new Date();
    historicoChamadas.push({
      tipo: isPreferencial ? "Senha Preferencial" : "Senha Normal",
      senha: texto,
      guiche: destino,
      data: agora.toLocaleDateString('pt-BR'),
      hora: agora.toLocaleTimeString('pt-BR'),
    });

    const botoesNaColuna = Array.from(coluna.querySelectorAll('button'));
    const limite = numeroSenha;
    const classeDestaque = isPreferencial ? 'botao-destacado-preferencial' : 'botao-destacado-normal';

    botoesNaColuna.forEach(btn => {
      btn.classList.remove('botao-destacado-normal', 'botao-destacado-preferencial');
    });

    botoesNaColuna.forEach(btn => {
      const match = btn.textContent.match(/Senha (\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num <= limite) {
          btn.classList.add(classeDestaque);
        }
      }
    });

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
              if (num === numeroSenha) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }
        });
      }
    }

    botao.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ultimaSenhaChamada = botao;
  };

  coluna.appendChild(botao);
}

async function chamarSenhaSincronizada(tipo, guiche) {
  const ref = firebase.database().ref(tipo === 'normal' ? 'contadorNormal' : 'contadorPreferencial');
  const snapshot = await ref.get();
  let contador = snapshot.exists() ? snapshot.val() : 0;

  const idColuna = tipo === 'normal'
    ? (guiche === 1 ? 'coluna-normal-guiche1' : 'coluna-normal-guiche2')
    : (guiche === 1 ? 'coluna-preferencial-guiche1' : 'coluna-preferencial-guiche2');

  const ultimaSenha = ultimasSenhasChamadas[idColuna] || 0;

  // Garante pegar o maior entre Firebase e clique manual
  const proximaSenha = Math.max(contador, ultimaSenha) + 1;

  await ref.set(proximaSenha);
  ultimasSenhasChamadas[idColuna] = proximaSenha;

  const coluna = document.getElementById(idColuna);
  const botoes = Array.from(coluna.querySelectorAll('button'));
  const botao = botoes.find(b => b.textContent.includes(`Senha ${proximaSenha} -`));

  if (botao) {
    botao.click();
  } else {
    console.error('Botão não encontrado:', `Senha ${proximaSenha} - Guichê ${guiche}`);
  }
}

function chamarSenhaLocal(tipo) {
  contadorLocal[tipo] += 1;
  const guiche = 'Pós Consulta';
  const idColuna = tipo === 'normal' ? 'coluna-normal-posconsulta' : 'coluna-preferencial-posconsulta';

  const coluna = document.getElementById(idColuna);
  const botoes = Array.from(coluna.querySelectorAll('button'));
  const botao = botoes.find(b => b.textContent.includes(`Senha ${contadorLocal[tipo]} -`));

  if (botao) {
    botao.click();
  } else {
    console.error('Botão não encontrado:', `Senha ${contadorLocal[tipo]} - ${guiche}`);
  }
}

document.addEventListener("keydown", function (event) {
  const tecla = event.key.toLowerCase();
  const inputNome = document.getElementById("nomePessoa");

  if (document.activeElement === inputNome) {
    return;
  }

  if (tecla === 'r') {
    repetirUltimaSenha();
  } else if (tecla === 'n') {
    esperarSegundoKey('n');
  } else if (tecla === 'p') {
    esperarSegundoKey('p');
  }
});

function esperarSegundoKey(tipo) {
  function segundaLetra(e) {
    const k = e.key;

    if (tipo === 'n') {
      if (k === '1') chamarSenhaSincronizada('normal', 1);
      else if (k === '2') chamarSenhaSincronizada('normal', 2);
      else if (k === '3') chamarSenhaLocal('normal');
    } else if (tipo === 'p') {
      if (k === '1') chamarSenhaSincronizada('preferencial', 1);
      else if (k === '2') chamarSenhaSincronizada('preferencial', 2);
      else if (k === '3') chamarSenhaLocal('preferencial');
    }

    document.removeEventListener('keydown', segundaLetra);
  }

  document.addEventListener('keydown', segundaLetra);
}
