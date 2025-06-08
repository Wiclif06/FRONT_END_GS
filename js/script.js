
function gerarID() {
  return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function atualizarListaTickets() {
  const lista = document.getElementById("listaTickets");
  const filtro = document.getElementById("filtroTicket")?.value.toLowerCase() || "";
  let contatos = [];

  
  try {
    contatos = JSON.parse(localStorage.getItem("contatos_ticket") || "[]");
  } catch (e) {
    localStorage.removeItem("contatos_ticket");
  }

  contatos = contatos.slice(-50);

  lista.innerHTML = contatos
    .filter(c => c.id.toLowerCase().includes(filtro) || c.nome.toLowerCase().includes(filtro) || c.email.toLowerCase().includes(filtro))
    .map((c, i) => `<div class="ticket">
      <strong>${c.id}</strong><br>
      Nome: ${c.nome}<br>
      Email: ${c.email}<br>
      ${c.mensagem}<br>
      <button onclick="deletarTicket(${i})">🗑️ Excluir</button>
    </div>`).join("");
}

function deletarTicket(index) {
  let contatos = JSON.parse(localStorage.getItem("contatos_ticket") || "[]");
  contatos.splice(index, 1);
  localStorage.setItem("contatos_ticket", JSON.stringify(contatos));
  atualizarListaTickets();
}

document.getElementById("formContato")?.addEventListener("submit", function(event) {
  event.preventDefault();

  let valido = true;
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  document.getElementById("erroNome").textContent = "";
  document.getElementById("erroEmail").textContent = "";
  document.getElementById("erroMensagem").textContent = "";
  document.getElementById("mensagemSucesso").textContent = "";

  if (nome.length < 3) {
    document.getElementById("erroNome").textContent = "O nome deve ter ao menos 3 caracteres.";
    valido = false;
  }
  if (!email.includes("@")) {
    document.getElementById("erroEmail").textContent = "Informe um email válido.";
    valido = false;
  }
  if (mensagem.length < 10) {
    document.getElementById("erroMensagem").textContent = "A mensagem deve conter pelo menos 10 caracteres.";
    valido = false;
  }

  if (valido) {
    const ticketId = gerarID();
    const novoContato = { id: ticketId, nome, email, mensagem };
    const contatosSalvos = JSON.parse(localStorage.getItem("contatos_ticket") || "[]");
    contatosSalvos.push(novoContato);
    localStorage.setItem("contatos_ticket", JSON.stringify(contatosSalvos));

    document.getElementById("mensagemSucesso").textContent = `Mensagem enviada com sucesso! Código do ticket: ${ticketId}`;
    document.getElementById("formContato").reset();
    atualizarListaTickets();
  }
});

function baixarContatos() {
  const contatos = JSON.parse(localStorage.getItem("contatos_ticket") || "[]");
  if (contatos.length === 0) {
    alert("Nenhum contato armazenado.");
    return;
  }
  let csv = "ID,Nome,Email,Mensagem\n";
  contatos.forEach(c => {
    csv += `"${c.id}","${c.nome}","${c.email}","${c.mensagem.replace(/\n/g, ' ')}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", "contatos_ticket.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

let debounce;
document.getElementById("filtroTicket")?.addEventListener("input", function () {
  clearTimeout(debounce);
  debounce = setTimeout(atualizarListaTickets, 300);
});

atualizarListaTickets();
