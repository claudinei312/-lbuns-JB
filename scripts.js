// Configuração da Supabase
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Função de login com código de acesso
function verificarCodigo() {
  const codigo = document.getElementById('codigoAcesso').value;
  if (codigo === '1811') {
    window.location.href = 'admin.html';
  } else {
    alert('Código inválido');
  }
}

// Cadastro de dados e envio de foto
async function cadastrarDados() {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const file = document.getElementById('foto').files[0];

  if (!nome || !cpf || !file) {
    alert('Preencha todos os campos e selecione uma foto.');
    return;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${cpf}_${Date.now()}.${fileExt}`;
  const filePath = `${cpf}/${fileName}`;

  let { error: uploadError } = await supabase.storage
    .from('fotos')
    .upload(filePath, file);

  if (uploadError) {
    alert('Erro ao enviar foto.');
    return;
  }

  const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(filePath);
  const fotoUrl = urlData.publicUrl;

  const { error: insertError } = await supabase
    .from('formandos')
    .insert([{ nome, cpf, foto: fotoUrl }]);

  if (insertError) {
    alert('Erro ao salvar os dados.');
  } else {
    alert('Dados cadastrados com sucesso!');
    document.getElementById('formCadastro').reset();
  }
}

// Buscar formandos por nome ou CPF
async function buscarFormando() {
  const termo = document.getElementById('buscaInput').value.trim();
  const container = document.getElementById('resultado');
  container.innerHTML = '';

  if (!termo) {
    alert('Digite um nome ou CPF.');
    return;
  }

  const { data, error } = await supabase
    .from('formandos')
    .select('*')
    .ilike('nome', `%${termo}%`);

  if (error || data.length === 0) {
    container.innerHTML = 'Nenhum resultado encontrado.';
    return;
  }

  data.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'foto-card';
    div.innerHTML = `
      <strong>${item.nome}</strong><br>
      CPF: ${item.cpf}<br>
      <img src="${item.foto}" class="foto-preview"><br>
      <input type="checkbox" class="selecionar-checkbox" value="${item.foto}">
    `;
    container.appendChild(div);
  });

  adicionarBotoesDeCompra(container);
}

// Adiciona os botões de compra
function adicionarBotoesDeCompra(container) {
  const botoes = document.createElement('div');
  botoes.innerHTML = `
    <h3>Escolha o tipo de álbum:</h3>
    <button onclick="selecionarCompra('digital')">Adquirir álbum digital (R$250,00)</button><br>
    <button onclick="selecionarCompra('fisico')">Adquirir álbum físico (R$330,00)</button><br>
    <button onclick="selecionarCompra('ambos')">Adquirir álbum digital + físico (R$470,00)</button>
  `;
  container.appendChild(botoes);
}

// Quando o usuário escolhe o tipo de compra
function selecionarCompra(tipo) {
  const nome = prompt('Digite seu nome completo:');
  const endereco = prompt('Digite seu endereço:');
  const telefone = prompt('Digite seu WhatsApp:');

  if (!nome || !endereco || !telefone) {
    alert('Todos os dados são obrigatórios.');
    return;
  }

  supabase
    .from('compras')
    .insert([{ nome, endereco, telefone, tipo }])
    .then(({ error }) => {
      if (error) {
        alert('Erro ao registrar a compra.');
      } else {
        alert('Compra registrada! Você só pagará após receber seu álbum.');
      }
    });
}

// Exibir lista de cadastros no painel
async function carregarListaDeFormandos() {
  const lista = document.getElementById('listaFormandos');
  if (!lista) return;

  const { data, error } = await supabase
    .from('formandos')
    .select('nome, cpf, foto');

  if (error) {
    lista.innerHTML = 'Erro ao carregar dados.';
    return;
  }

  const agrupados = {};
  data.forEach(({ nome, cpf, foto }) => {
    if (!agrupados[cpf]) {
      agrupados[cpf] = { nome, fotos: [] };
    }
    agrupados[cpf].fotos.push(foto);
  });

  Object.entries(agrupados).forEach(([cpf, dados]) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${dados.nome}</strong> - CPF: ${cpf} - Fotos: ${dados.fotos.length}<br><br>
    `;
    lista.appendChild(div);
  });
}

// Exibir lista de compras no painel
async function carregarCompras() {
  const compras = document.getElementById('listaCompras');
  if (!compras) return;

  const { data, error } = await supabase
    .from('compras')
    .select('*');

  if (error || data.length === 0) {
    compras.innerHTML = 'Nenhuma compra registrada.';
    return;
  }

  data.forEach((compra) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${compra.nome}</strong><br>
      Álbum: ${compra.tipo}<br>
      Endereço: ${compra.endereco}<br>
      WhatsApp: ${compra.telefone}<br><hr>
    `;
    compras.appendChild(div);
  });
}

// Executa funções de carregamento automáticas
window.onload = () => {
  carregarListaDeFormandos();
  carregarCompras();
};
