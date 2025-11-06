const formLista = document.getElementById('formLista');
const listaItems = document.getElementById('listaItems');

async function carregarLista() {
    try {
        const response = await fetch('http://localhost:3000/lista');
        const items = await response.json();
        
        listaItems.innerHTML = '';
        items.forEach(item => {
            adicionarItemNaLista(item);
        });
    } catch (error) {
        console.error('Erro ao carregar lista:', error);
    }
}

formLista.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const item = {
        nome_listaCompra: document.getElementById('item').value,
        quantidade_listaCompra: parseInt(document.getElementById('quantidade').value),
        descricao_listaCompra: document.getElementById('descricao').value || null
    };
    
    console.log('Enviando dados:', item);
    try {
        const response = await fetch('http://localhost:3000/lista/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
        });

        const data = await response.json();
        
        if (response.ok) {
            carregarLista();
            formLista.reset();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item');
    }
});

function adicionarItemNaLista(item) {
    const divItem = document.createElement('div');
    divItem.className = `item ${item.comprado_listaCompra ? 'comprado' : ''}`;
    divItem.innerHTML = `
        <div class="item-info">
            <strong>${item.nome_listaCompra}</strong> - ${item.quantidade_listaCompra}
            ${item.descricao_listaCompra ? `<br><small>${item.descricao_listaCompra}</small>` : ''}
        </div>
        <div class="item-acoes">
            <button class="btn-acao btn-editar" onclick="editarItem(${item.id_listaCompra})">✏️</button>
            <button class="btn-acao btn-comprado" onclick="marcarItem(${item.id_listaCompra})">✓</button>
            <button class="btn-acao btn-deletar" onclick="deletarItem(${item.id_listaCompra})">🗑️</button>
        </div>
    `;
    listaItems.appendChild(divItem);
}

async function editarItem(id) {
    const novaQuantidade = prompt('Digite a nova quantidade:');
    if (novaQuantidade === null || novaQuantidade === '') return;

    try {
        const response = await fetch(`http://localhost:3000/lista/editar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantidade_listaCompra: novaQuantidade })
        });

        if (response.ok) {
            carregarLista();
        } else {
            alert('Erro ao atualizar item');
        }
    } catch (error) {
        console.error('Erro ao editar item:', error);
        alert('Erro ao editar item');
    }
}

async function marcarItem(id) {
    try {
        const response = await fetch(`http://localhost:3000/lista/marcar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            carregarLista();
        } else {
            alert('Erro ao marcar item');
        }
    } catch (error) {
        console.error('Erro ao marcar item:', error);
        alert('Erro ao marcar item');
    }
}

async function deletarItem(id) {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    try {
        const response = await fetch(`http://localhost:3000/lista/deletar/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarLista();
        } else {
            alert('Erro ao deletar item');
        }
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        alert('Erro ao deletar item');
    }
}

carregarLista();
