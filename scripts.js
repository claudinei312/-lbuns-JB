// Acesso ao painel com código de 4 dígitos
function checkAccessCode() {
  const code = document.getElementById('access-code').value;
  if (code === '1811') {
    document.getElementById('login-area').classList.add('hidden');
    document.getElementById('admin-area').classList.remove('hidden');
    carregarFormandos();
    carregarCompras();
  } else {
    document.getElementById('login-error').innerText = 'Código incorreto.';
  }
}

// Armazenamento local de dados
let formandos = JSON.parse(localStorage.getItem('formandos')) || [];
let compras = JSON.parse(localStorage.getItem('compras')) || [];

function salvarCadastro() {
  const nome = document.getElementById('nome').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const fotosInput = document.getElementById('fotos');

  if (!nome || !cpf || fotosInput.files.length === 0) {
    alert('Preencha todos os campos e adicione pelo menos uma foto.');
    return;
  }

  const fotos = [];
  for (let file of fotosInput.files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      fotos.push(e.target.result);
      if (fotos.length === fotosInput.files.length) {
        formandos.push({ nome, cpf, fotos });
        localStorage.setItem('formandos', JSON.stringify(formandos));
        alert('Cadastro salvo com sucesso!');
        document.getElementById('nome').value = '';
        document.getElementById('cpf').value = '';
        document.getElementById('fotos').value = '';
        carregarFormandos();
      }
    };
    reader.readAsDataURL(file);
  }
}

function carregarFormandos() {
  const container = document.getElementById('lista-formandos');
  container.innerHTML = '';
  formandos.forEach((f, index) => {
    const div = document.createElement('div');
    div.className = 'person-entry';
    div.innerHTML = `
      <strong>${f.nome}</strong><br>
      CPF: ${f.cpf}<br>
      Fotos: ${f.fotos.length}<br><br>
      <div>${f.fotos.map((src, i) => `
        <input type="checkbox" id="foto-${index}-${i}">
        <img src="${src}" width="100" style="margin:5px">
      `).join('')}</div>
      <br>
      <button onclick="comprar('${f.nome}', '${f.cpf}', 'digital')">Adquirir Álbum Digital (R$250,00)</button>
      <button onclick="comprar('${f.nome}', '${f.cpf}', 'fisico')">Adquirir Álbum Físico (R$330,00)</button>
      <button onclick="comprar('${f.nome}', '${f.cpf}', 'ambos')">Adquirir Ambos (R$470,00)</button>
    `;
    container.appendChild(div);
  });
}

function comprar(nome, cpf, tipo) {
  const preco = tipo === 'digital' ? 250 :
                tipo === 'fisico' ? 330 : 470;
  const dados = prompt(`Preencha os dados para envio do álbum (nome completo e endereço):`);
  if (dados) {
    compras.push({ nome, cpf, tipo, preco, dados });
    localStorage.setItem('compras', JSON.stringify(compras));
    alert('Compra registrada! Envio será feito após a entrega do álbum.');
    carregarCompras();
  }
}

function carregarCompras() {
  const container = document.getElementById('compras-registradas');
  container.innerHTML = '';
  compras.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'person-entry';
    div.innerHTML = `
      <strong>${c.nome}</strong><br>
      CPF: ${c.cpf}<br>
      Tipo: ${c.tipo.toUpperCase()}<br>
      Valor: R$${c.preco},00<br>
      Dados: ${c.dados}
    `;
    container.appendChild(div);
  });
}
