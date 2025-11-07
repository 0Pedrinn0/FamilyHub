document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('loginForm');
	if (!form) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		const nome_usuario = (formData.get('nome_usuario') || '').toString().trim();
		const senha_usuario = (formData.get('senha_usuario') || '').toString().trim();

		if (!nome_usuario || !senha_usuario) {
			alert('Por favor preencha usuário e senha.');
			return;
		}

		try {
			const res = await fetch('http://localhost:3000/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nome_usuario, senha_usuario })
			});

			if (res.ok) {
				const data = await res.json();
				window.location.href = 'index.html';
			} else if (res.status === 401) {
				const err = await res.json();
				alert(err.message || 'Usuário ou senha inválidos.');
			} else {
				const err = await res.json().catch(() => ({}));
				alert(err.message || 'Erro no servidor.');
			}
		} catch (error) {
			console.error('Erro ao conectar ao servidor:', error);
			alert('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
		}
	});
});

