// Carregar médicos do localStorage
const medicos = JSON.parse(localStorage.getItem("medicos")) || [];

// Mensagem de status
function mostrarMensagem(texto, tipo = "info") {
  const msg = document.getElementById("mensagem-status");
  msg.textContent = texto;
  msg.style.color = tipo === "erro" ? "red" : "green";
}

// Cadastro de médico
function cadastrarMedico() {
  const nome = document.getElementById("nome-medico").value;
  const crm = document.getElementById("crm-medico").value;
  const especialidade = document.getElementById("especialidade-medico").value;
  const tipo = document.getElementById("tipo-atendimento").value;

  const dias = Array.from(document.querySelectorAll("#dias-atendimento input:checked"))
                    .map(el => el.value);
  const horarios = Array.from(document.querySelectorAll("#horarios-atendimento input:checked"))
                        .map(el => el.value);

  if (!nome || !crm || !especialidade || dias.length === 0 || horarios.length === 0 || !tipo) {
    mostrarMensagem("Preencha todos os campos corretamente.", "erro");
    return;
  }

  const medico = { nome, crm, especialidade, dias, horarios, tipo };
  medicos.push(medico);
  localStorage.setItem("medicos", JSON.stringify(medicos));
  mostrarMensagem("Médico cadastrado com sucesso!");
  atualizarTabelaMedicos();
  limparCampos();
}

// Limpar campos
function limparCampos() {
  document.getElementById("nome-medico").value = "";
  document.getElementById("crm-medico").value = "";
  document.getElementById("especialidade-medico").value = "";
  document.getElementById("tipo-atendimento").value = "";

  document.querySelectorAll("#dias-atendimento input").forEach(el => el.checked = false);
  document.querySelectorAll("#horarios-atendimento input").forEach(el => el.checked = false);
}

// Atualizar tabela de médicos
function atualizarTabelaMedicos() {
  const tabela = document.getElementById("tabela-medicos");
  tabela.innerHTML = "";
  medicos.forEach((m) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${m.nome}</td>
      <td>${m.especialidade}</td>
      <td>${m.dias.join(", ")}</td>
      <td>${m.horarios.join(", ")}</td>
      <td>${m.tipo}</td>
    `;
    tabela.appendChild(linha);
  });
}

// Inicializar
atualizarTabelaMedicos();
