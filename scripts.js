const codeAccess = '1811';  // Código de acesso para painel
let formandos = [];  // Armazenar dados dos formandos

// Função para verificar o código e permitir acesso ao painel
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputCode = document.getElementById('code').value;

    if (inputCode === codeAccess) {
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
    } else {
        alert('Código incorreto!');
    }
});

// Função para cadastrar novos formandos
document.getElementById('formCadastro').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const fotos = document.getElementById('foto').files;

    if (nome && cpf && fotos.length > 0) {
        const formand = {
            nome: nome,
            cpf: cpf,
            fotos: Array.from(fotos).map(foto => URL.createObjectURL(foto))
        };
        formandos.push(formand);
        atualizarTabela();

        // Limpar campos após cadastro
        document.getElementById('formCadastro').reset();
    } else {
        alert('Preencha todos os campos!');
    }
});

// Função para atualizar a tabela de formandos cadastrados
function atualizarTabela() {
    const tabelaBody = document.querySelector('#tabelaCadastro tbody');
    tabelaBody.innerHTML = '';

    formandos.forEach(formand => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formand.nome}</td>
            <td>${formand.cpf}</td>
            <td><button onclick="exibirFotos('${formand.nome}')">Ver Fotos</button></td>
            <td><button onclick="deletarFormando('${formand.cpf}')">Deletar</button></td>
        `;
        tabelaBody.appendChild(row);
    });
}

// Função para exibir as fotos do formando
function exibirFotos(nome) {
    const formando = formandos.find(f => f.nome === nome);
    if (formando) {
        let imagens = '<h3>Fotos:</h3>';
        formando.fotos.forEach(foto => {
            imagens += `<img src="${foto}" alt="Foto do formando" width="100"><br>`;
        });
        alert(imagens);
    }
}

// Função para deletar um formando
function deletarFormando(cpf) {
    formandos = formandos.filter(f => f.cpf !== cpf);
    atualizarTabela();
}
