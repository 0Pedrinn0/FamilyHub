const formLembrete = document.getElementById('formLembrete');
const listaLembretes = document.getElementById('listaLembretes');

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function formatarHora(hora) {
    return hora ? hora.substring(0, 5) : '';
}

async function carregarLembretes() {
    try {
        const response = await fetch('http://localhost:3000/lembretes');
        const lembretes = await response.json();
        
        listaLembretes.innerHTML = '';
        lembretes.forEach(lembrete => {
            adicionarLembreteNaLista(lembrete);
        });
    } catch (error) {
        console.error('Erro ao carregar lembretes:', error);
    }
}

formLembrete.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const lembrete = {
        titulo_lembrete: document.getElementById('titulo').value,
        discricao_lembrete: document.getElementById('descricao').value,
        data_lembrete: document.getElementById('data').value,
        horario_lembrete: document.getElementById('horario').value || null
    };

    try {
        const response = await fetch('http://localhost:3000/lembretes/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lembrete)
        });

        const data = await response.json();
        
        if (response.ok) {
            carregarLembretes();
            formLembrete.reset();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro ao adicionar lembrete:', error);
        alert('Erro ao adicionar lembrete');
    }
});

function adicionarLembreteNaLista(lembrete) {
    const divLembrete = document.createElement('div');
    divLembrete.className = `lembrete ${lembrete.concluido ? 'concluido' : ''}`;
    divLembrete.innerHTML = `
        <div class="lembrete-header">
            <div class="lembrete-titulo">${lembrete.titulo_lembrete}</div>
            <div class="lembrete-data">
                ${formatarData(lembrete.data_lembrete)}
                ${lembrete.horario_lembrete ? ' - ' + formatarHora(lembrete.horario_lembrete) : ''}
            </div>
        </div>
        <div class="lembrete-descricao">${lembrete.discricao_lembrete}</div>
        <div class="lembrete-acoes">
            <button class="btn-acao btn-editar" onclick="editarLembrete(${lembrete.id_lembrete})">✏️</button>
            <button class="btn-acao btn-concluido" onclick="marcarLembrete(${lembrete.id_lembrete})">✓</button>
            <button class="btn-acao btn-deletar" onclick="deletarLembrete(${lembrete.id_lembrete})">🗑️</button>
        </div>
    `;
    listaLembretes.appendChild(divLembrete);
}

async function editarLembrete(id) {
    const lembrete = await buscarLembrete(id);
    if (!lembrete) return;

    const novoTitulo = prompt('Digite o novo título:', lembrete.titulo_lembrete);
    if (novoTitulo === null) return;

    const novaDescricao = prompt('Digite a nova descrição:', lembrete.discricao_lembrete);
    if (novaDescricao === null) return;

    const novaData = prompt('Digite a nova data (AAAA-MM-DD):', lembrete.data_lembrete);
    if (novaData === null) return;

    const novoHorario = prompt('Digite o novo horário (HH:MM) ou deixe vazio:', lembrete.horario_lembrete || '');

    try {
        const response = await fetch(`http://localhost:3000/lembretes/editar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo_lembrete: novoTitulo,
                discricao_lembrete: novaDescricao,
                data_lembrete: novaData,
                horario_lembrete: novoHorario || null
            })
        });

        if (response.ok) {
            carregarLembretes();
        } else {
            alert('Erro ao atualizar lembrete');
        }
    } catch (error) {
        console.error('Erro ao editar lembrete:', error);
        alert('Erro ao editar lembrete');
    }
}

async function buscarLembrete(id) {
    try {
        const response = await fetch(`http://localhost:3000/lembretes/${id}`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar lembrete:', error);
        return null;
    }
}

async function marcarLembrete(id) {
    try {
        const response = await fetch(`http://localhost:3000/lembretes/marcar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            carregarLembretes();
        } else {
            alert('Erro ao marcar lembrete');
        }
    } catch (error) {
        console.error('Erro ao marcar lembrete:', error);
        alert('Erro ao marcar lembrete');
    }
}

async function deletarLembrete(id) {
    if (!confirm('Tem certeza que deseja deletar este lembrete?')) return;

    try {
        const response = await fetch(`http://localhost:3000/lembretes/deletar/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarLembretes();
        } else {
            alert('Erro ao deletar lembrete');
        }
    } catch (error) {
        console.error('Erro ao deletar lembrete:', error);
        alert('Erro ao deletar lembrete');
    }
}

carregarLembretes();