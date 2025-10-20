// Carregar dados do localStorage
const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
const agendamentos = JSON.parse(localStorage.getItem("atendimentos")) || [];

// Inicializar agendamento
function inicializarAgendamento() {
  const selectPaciente = document.getElementById("select-paciente");
  pacientes.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.nome;
    opt.textContent = p.nome;
    selectPaciente.appendChild(opt);
  });

  preencherMedicos();
  atualizarTabelaAgendamentos();
}

// Preencher médicos
function preencherMedicos() {
  const selectMedico = document.getElementById("select-medico");
  selectMedico.innerHTML = "<option value=''>Selecione</option>";
  medicos.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.nome;
    opt.textContent = `${m.nome} (${m.especialidade})`;
    selectMedico.appendChild(opt);
  });
}

// Evento ao selecionar médico
document.getElementById("select-medico").addEventListener("change", () => {
  const nomeMedico = document.getElementById("select-medico").value;
  const medico = medicos.find(m => m.nome === nomeMedico);

  const diasSpan = document.getElementById("dias-atendimento");
  diasSpan.textContent = medico ? `Atende: ${medico.dias.join(", ")}` : "";

  atualizarHorariosDisponiveis();
});

// Evento ao selecionar data
document.getElementById("data-consulta").addEventListener("change", atualizarHorariosDisponiveis);

// Atualizar horários disponíveis
// Arquivo: js/agendamento.js

// ... (todo o código anterior do arquivo permanece igual) ...

// ATUALIZE ESTA FUNÇÃO
function atualizarHorariosDisponiveis() {
  const nomeMedico = document.getElementById("select-medico").value;
  const dataConsulta = document.getElementById("data-consulta").value;
  const horarioSelect = document.getElementById("horario-consulta");
  horarioSelect.innerHTML = "<option value=''>Selecione um horário</option>"; // Mensagem melhorada

  // Limpa a mensagem de status anterior ao tentar novamente
  mostrarMensagem("", "info"); 

  if (!nomeMedico || !dataConsulta) {
    horarioSelect.innerHTML = "<option value=''>Selecione médico e data</option>";
    return;
  }

  const medico = medicos.find(m => m.nome === nomeMedico);
  if (!medico) return;

  // --- INÍCIO DA CORREÇÃO ---

  // 1. CORREÇÃO DO FUSO HORÁRIO: Adicionamos 'T00:00' para tratar a data como local.
  const dataLocal = new Date(dataConsulta + 'T00:00');
  
  // 2. CORREÇÃO DA COMPARAÇÃO DO DIA: Obtemos o dia e removemos o "-feira".
  let diaSemana = dataLocal.toLocaleDateString("pt-BR", { weekday: "long" });
  if (diaSemana.includes("-feira")) {
    diaSemana = diaSemana.split("-")[0];
  }
  
  // Normalizamos as strings para garantir a comparação (remove acentos e deixa minúscula)
  const diaFormatado = removerAcentos(diaSemana.toLowerCase());
  const diasMedico = medico.dias.map(d => removerAcentos(d.toLowerCase()));

  // --- FIM DA CORREÇÃO ---

  if (!diasMedico.includes(diaFormatado)) {
    // Usamos toLocaleDateString novamente para garantir a exibição correta do dia.
    const diaExibicao = dataLocal.toLocaleDateString("pt-BR", { weekday: 'long' });
    mostrarMensagem(`O médico não atende às ${diaExibicao}s.`, "erro");
    return;
  }

  // Se o dia estiver correto, preenche os horários
  medico.horarios.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h;
    opt.textContent = h;
    horarioSelect.appendChild(opt);
  });
}

// ... (o resto do seu código no arquivo agendamento.js continua aqui) ...
// Função para remover acentos
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Realizar agendamento
function realizarAgendamento() {
  const paciente = document.getElementById("select-paciente").value;
  const medico = document.getElementById("select-medico").value;
  const data = document.getElementById("data-consulta").value;
  const horario = document.getElementById("horario-consulta").value;
  const anamnese = document.getElementById("anamnese").value;

  if (!paciente || !medico || !data || !horario || !anamnese) {
    mostrarMensagem("Preencha todos os campos corretamente.", "erro");
    return;
  }

  const especialidade = medicos.find(m => m.nome === medico)?.especialidade || "";

  const agendamento = { paciente, medico, data, horario, anamnese, especialidade };
  agendamentos.push(agendamento);
  localStorage.setItem("atendimentos", JSON.stringify(agendamentos));

  mostrarMensagem("Consulta agendada com sucesso!");
  atualizarTabelaAgendamentos();
  limparCampos();
}

// Mostrar mensagem
function mostrarMensagem(texto, tipo = "info") {
  const msg = document.getElementById("mensagem-status");
  msg.textContent = texto;
  msg.style.color = tipo === "erro" ? "red" : "green";
}

// Atualizar tabela de agendamentos
function atualizarTabelaAgendamentos() {
  const tabela = document.getElementById("tabela-agendamentos");
  tabela.innerHTML = "";
  agendamentos.forEach(a => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${a.paciente}</td>
      <td>${a.medico}</td>
      <td>${a.data}</td>
      <td>${a.horario}</td>
      <td>${a.anamnese}</td>
    `;
    tabela.appendChild(linha);
  });
}

// Limpar campos após agendamento
function limparCampos() {
  document.getElementById("select-medico").value = "";
  document.getElementById("data-consulta").value = "";
  document.getElementById("horario-consulta").innerHTML = "<option value=''>Selecione</option>";
  document.getElementById("anamnese").value = "";
}
