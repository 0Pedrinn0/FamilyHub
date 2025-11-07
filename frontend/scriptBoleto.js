function adicionarBoleto() {
    const descricao = document.getElementById('descricaoBoleto').value;
    const valor = document.getElementById('valorBoleto').value;
    const vencimento = document.getElementById('vencimentoBoleto').value;
    
    if (!descricao || !valor || !vencimento) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const dataFormatada = new Date(vencimento).toLocaleDateString('pt-BR');
    
    const novoBoleto = document.createElement('div');
    novoBoleto.className = 'boleto';
    novoBoleto.setAttribute('data-status', 'pendente');
    
    novoBoleto.innerHTML = `
        <div class="boleto-info">
            <h3>${descricao}</h3>
            <p class="valor">R$ ${parseFloat(valor).toFixed(2)}</p>
            <p class="vencimento">Vence em: ${dataFormatada}</p>
            <span class="status">Aguardando Pagamento</span>
        </div>
        <div class="boleto-acoes">
            <button class="marcar-pago" onclick="marcarComoPago(this)">✓</button>
            <button class="excluir" onclick="excluirBoleto(this)">×</button>
        </div>
    `;

    document.querySelector('.lista-boletos').prepend(novoBoleto);
    
    document.getElementById('descricaoBoleto').value = '';
    document.getElementById('valorBoleto').value = '';
    document.getElementById('vencimentoBoleto').value = '';
}

function marcarComoPago(botao) {
    const boleto = botao.closest('.boleto');
    if (boleto.getAttribute('data-status') === 'pendente') {
        boleto.classList.add('pago');
        boleto.setAttribute('data-status', 'pago');
        boleto.querySelector('.status').textContent = 'Pago';
    } else {
        boleto.classList.remove('pago');
        boleto.setAttribute('data-status', 'pendente');
        boleto.querySelector('.status').textContent = 'Aguardando Pagamento';
    }
}

function excluirBoleto(botao) {
    if (confirm('Tem certeza que deseja excluir este boleto?')) {
        botao.closest('.boleto').remove();
    }
}