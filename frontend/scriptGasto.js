    const aparelhos = [
      { nome: "Geladeira", potencia: 150 },
      { nome: "TV LED", potencia: 100 },
      { nome: "Computador", potencia: 200 },
      { nome: "Lâmpada LED", potencia: 10 },
      { nome: "Ventilador", potencia: 80 },
      { nome: "Ar-condicionado", potencia: 1200 },
      { nome: "Micro-ondas", potencia: 1200 },
      { nome: "Máquina de lavar", potencia: 500 },
      { nome: "Air Fryer", potencia: 1500 },
      { nome: "Fogão de indução", potencia: 1000 },
      { nome: "Chuveiro elétrico", potencia: 6800 },
    ];

    const tabela = document.getElementById("tabelaAparelhos");

    aparelhos.forEach((a, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${a.nome}</td>
        <td>${a.potencia}</td>
        <td><input type="number" id="qtd${i}" value="0" min="0"></td>
        <td><input type="number" id="horas${i}" value="0" min="0" max="24"></td>
      `;
      tabela.appendChild(row);
    });

    function calcularConsumo() {
      let totalKwh = 0;
      const diasMes = 30;
      const valorKwh = parseFloat(document.getElementById("valorKwh").value);

      aparelhos.forEach((a, i) => {
        const qtd = parseInt(document.getElementById(`qtd${i}`).value) || 0;
        const horas = parseFloat(document.getElementById(`horas${i}`).value) || 0;
        const consumo = (a.potencia * horas * diasMes * qtd) / 1000;
        totalKwh += consumo;
      });

      const custo = totalKwh * valorKwh;

      document.getElementById("resultado").innerHTML = `
        <strong>Consumo mensal estimado:</strong> ${totalKwh.toFixed(2)} kWh<br>
        <strong>Valor estimado da conta:</strong> R$ ${custo.toFixed(2)}
      `;
    }