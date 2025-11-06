document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    try {
        const response = await fetch('http://localhost:3000/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            this.reset();
        }
    }
    catch (error) {
        alert("Erro ao cadastrar o usuário: " + error.message);
    }
});