const participantes = [];
let participanteEmEdicao = null;
let ordemCrescente = null; // null = inicial (🔤), true = crescente (⬆️), false = decrescente (⬇️)

function adicionarParticipante(event) {
    event.preventDefault();
    const input = document.getElementById("input_nome");
    const nome = input.value.trim();

    if (!nome) return;

    if (participanteEmEdicao !== null) {
        // Se estiver em modo de alteração, atualiza o nome do participante
        participanteEmEdicao.nome = nome;
        participanteEmEdicao = null;
        document.getElementById("btn_adicionar").textContent = "Adicionar";
    } else {
        // Caso contrário, adiciona um novo participante
        const obj = {
            id: participantes.length + 1,
            nome: nome
        };
        participantes.push(obj);
    }

    input.value = "";
    console.log(participantes);
    listar();
}

// Alterna a ordenação por nome: primeiro clique crescente (⬆️), segundo decrescente (⬇️)
function alternarOrdenacao(event) {
    if (event) {
        event.stopPropagation();
    }
    if (ordemCrescente === null || ordemCrescente === false) {
        ordemCrescente = true;
    } else {
        ordemCrescente = false;
    }
    listar();
}

function alterar(id) {
    const participante = participantes.find(p => p.id === id);
    if (participante) {
        participanteEmEdicao = participante;
        document.getElementById("input_nome").value = participante.nome;
        document.getElementById("input_nome").focus();
        document.getElementById("btn_adicionar").textContent = "Confirmar";
    }
}

function excluir(id) {
    const index = participantes.findIndex(p => p.id === id);
    if (index !== -1) {
        // Se o participante excluído estava em edição, cancela a edição
        if (participanteEmEdicao === participantes[index]) {
            participanteEmEdicao = null;
            document.getElementById("input_nome").value = "";
            document.getElementById("btn_adicionar").textContent = "Adicionar";
        }
        participantes.splice(index, 1);
    }
    listar();
}

function listar(sorteadoId) {
    // Ordena os participantes conforme a direção definida
    if (ordemCrescente === false) {
        participantes.sort((a, b) => b.nome.localeCompare(a.nome));
    } else if (ordemCrescente === true) {
        participantes.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    // Atualiza o texto do botão no cabeçalho
    const btnOrdenar = document.getElementById("btn_ordenar");
    if (btnOrdenar) {
        if (ordemCrescente === true) {
            btnOrdenar.textContent = "⬆️";
        } else if (ordemCrescente === false) {
            btnOrdenar.textContent = "⬇️";
        } else {
            btnOrdenar.textContent = "🔤";
        }
    }

    // Atualiza os IDs para ficarem sempre sequenciais (1, 2, 3...)
    participantes.forEach((p, index) => {
        p.id = index + 1;
    });

    const tbody = document.getElementById("lista");
    tbody.innerHTML = '';

    if (participantes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3">Nenhum participante</td>
            </tr>
        `;
        return;
    }

    participantes.forEach(p => {
        const tr = document.createElement("tr");
        if (p.id == sorteadoId) {
            tr.classList.add('sorteado', 'destaque');
        }
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nome}</td>
            <td>
                <button type="button" onclick="alterar(${p.id})">Alterar</button>
                <button type="button" onclick="excluir(${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function sortear() {
    if (participantes.length === 0) return;
    const idx = Math.floor(Math.random() * participantes.length);
    const sorteado = participantes[idx];
    listar(sorteado.id);
}

// Aliases
window.alternarOrdenacao = alternarOrdenacao;
window.ordenarPorNome = alternarOrdenacao;