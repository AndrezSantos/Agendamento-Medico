// Carregar dados do localStorage
const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
const atendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];

// Utilitário para calcular idade
function calcularIdade() {
  const dataNascimento = document.getElementById("data-nascimento").value;
  if (!dataNascimento) return;

  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  document.getElementById("idade").value = idade;
}

// Mensagem de status
function mostrarMensagem(texto, tipo = "info") {
  const msg = document.getElementById("mensagem-status");
  msg.textContent = texto;
  msg.style.color = tipo === "erro" ? "red" : "green";
}

// Cadastro de paciente
function cadastrarPaciente() {
  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const cpf = document.getElementById("cpf").value;
  const endereco = document.getElementById("endereco").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;
  const telefone = document.getElementById("telefone").value;

  if (!nome || !idade || !cpf || !endereco || !bairro || !cidade || !estado || !telefone) {
    mostrarMensagem("Preencha todos os campos corretamente.", "erro");
    return;
  }

  const paciente = { nome, idade, cpf, endereco, bairro, cidade, estado, telefone };
  pacientes.push(paciente);
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
  mostrarMensagem("Paciente cadastrado com sucesso!");
  atualizarTabelaPacientes();
  limparCampos();
}

// Limpar campos
function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("data-nascimento").value = "";
  document.getElementById("idade").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("estado").value = "";
  document.getElementById("telefone").value = "";
}

// Atualizar tabela de pacientes
function atualizarTabelaPacientes() {
  const tabela = document.getElementById("tabela-pacientes");
  tabela.innerHTML = "";
  pacientes.forEach((p) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `<td>${p.nome}</td><td>${p.idade}</td>`;
    linha.style.cursor = "pointer";
    linha.onclick = () => exibirAtendimentosDoPaciente(p.nome);
    tabela.appendChild(linha);
  });
}

// Exibir atendimentos do paciente selecionado
// Arquivo: js/paciente.js

// ... (todo o código anterior do arquivo permanece igual) ...

// SUBSTITUA A FUNÇÃO ANTIGA POR ESTA
function exibirAtendimentosDoPaciente(nomePaciente) {
  // 1. Pega a referência da tabela de atendimentos que queremos preencher
  const tabelaAtendimentos = document.getElementById("tabela-atendimentos");
  
  // 2. Limpa a tabela de qualquer informação anterior
  tabelaAtendimentos.innerHTML = "";

  // Carrega todos os atendimentos salvos no localStorage
  const todosAtendimentos = JSON.parse(localStorage.getItem("atendimentos")) || [];
  
  // 3. Filtra para encontrar apenas os atendimentos do paciente que foi clicado
  const atendimentosFiltrados = todosAtendimentos.filter(a => a.paciente === nomePaciente);

  // 4. Verifica se o paciente tem algum histórico de atendimento
  if (atendimentosFiltrados.length === 0) {
    // Se não tiver, exibe uma mensagem amigável na própria tabela
    const linha = document.createElement("tr");
    linha.innerHTML = `<td colspan="3">Nenhum atendimento encontrado para este paciente.</td>`;
    tabelaAtendimentos.appendChild(linha);
    return; // Encerra a função aqui
  }

  // 5. Se encontrou atendimentos, percorre a lista e cria uma linha para cada um
  atendimentosFiltrados.forEach(atendimento => {
    const linha = document.createElement("tr");
    // Preenche as colunas com os dados do atendimento (Data, Especialidade, Anamnese)
    linha.innerHTML = `
      <td>${atendimento.data}</td>
      <td>${atendimento.especialidade}</td>
      <td>${atendimento.anamnese}</td>
    `;
    // Adiciona a nova linha na tabela
    tabelaAtendimentos.appendChild(linha);
  });
}

// ... (o resto do seu código no arquivo paciente.js continua aqui) ...

// Inicializar
atualizarTabelaPacientes();

function alternarTema() {
  document.body.classList.toggle("dark-mode");
}