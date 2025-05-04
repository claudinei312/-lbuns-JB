// Função para verificar o código de acesso
function verificarAcesso() {
    const codigoAcesso = document.getElementById('codigoAcesso').value;

    if (codigoAcesso === '1811') {
        window.location.href = 'admin.html';  // Redireciona para o painel de admin
    } else {
        alert('Código de acesso inválido!');
    }
}

// Função para cadastrar os dados do formando e foto
function cadastrarFormando() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const fotos = document.getElementById('fotos').files;

    if (!nome || !cpf || fotos.length === 0) {
        alert('Por favor, preencha todos os campos e adicione uma foto.');
        return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cpf', cpf);

    for (let i = 0; i < fotos.length; i++) {
        formData.append('fotos[]', fotos[i]);
    }

    fetch('cadastro.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cadastro realizado com sucesso!');
            listarFormandos();
        } else {
            alert('Erro ao cadastrar os dados.');
        }
    })
    .catch(error => console.error('Erro:', error));
}

// Função para listar todos os formandos cadastrados
function listarFormandos() {
    fetch('listar.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';  // Limpa a tabela antes de preencher

            data.formandos.forEach(formando => {
                const tr = document.createElement('tr');

                const tdNome = document.createElement('td');
                tdNome.textContent = formando.nome;

                const tdCpf = document.createElement('td');
                tdCpf.textContent = formando.cpf;

                const tdFotos = document.createElement('td');
                tdFotos.textContent = formando.fotos.length;

                tr.appendChild(tdNome);
                tr.appendChild(tdCpf);
                tr.appendChild(tdFotos);

                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao listar formandos:', error));
}

// Função para retornar à página inicial
function voltarInicio() {
    window.location.href = 'index.html';
}

// Função para selecionar múltiplas fotos
document.getElementById('fotos').setAttribute('multiple', 'true');

// Chama a função para listar os formandos ao carregar o painel
window.onload = function() {
    listarFormandos();
};
