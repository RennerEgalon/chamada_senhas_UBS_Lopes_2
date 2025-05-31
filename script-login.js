function abrirIndexENFecharAtual() {
  window.open("index.html", "_blank");
  window.close();
}

function processarCadastro() {
  const cpf = document.getElementById("cpf").value;
  const senha = document.getElementById("senha").value;

  if (!cpf || !senha) {
    alert("Por favor, preencha ambos CPF e Senha.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (usuarios[cpf]) {
    alert("Este CPF já está cadastrado.");
    return;
  }

  usuarios[cpf] = { cpf: cpf, senha: senha };
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Usuário cadastrado com sucesso!");
}

function realizarLogin() {
  const cpf = document.getElementById("cpf").value;
  const senha = document.getElementById("senha").value;

  if (!cpf || !senha) {
    alert("Por favor, preencha CPF e Senha.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

  if (usuarios[cpf] && usuarios[cpf].senha === senha) {
    sessionStorage.setItem("acessoLiberado", "true");
    alert("Login bem-sucedido!");
    abrirIndexENFecharAtual();
  } else {
    alert("CPF ou senha incorretos.");
  }
}

// Função "Esqueceu sua senha?"
function esquecerSenha() {
  const cpf = prompt("Digite o CPF para recuperar a senha:");
  if (!cpf) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
  if (usuarios[cpf]) {
    alert(`Sua senha cadastrada é: ${usuarios[cpf].senha}`);
  } else {
    alert("CPF não encontrado.");
  }
}

// Função "Trocar senha"
function trocarSenha() {
  const cpf = prompt("Digite o CPF para trocar a senha:");
  if (!cpf) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
  if (!usuarios[cpf]) {
    alert("CPF não encontrado.");
    return;
  }

  const novaSenha = prompt("Digite a nova senha:");
  if (!novaSenha) {
    alert("Senha não pode ser vazia.");
    return;
  }

  usuarios[cpf].senha = novaSenha;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Senha alterada com sucesso!");
}
