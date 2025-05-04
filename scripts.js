// Conexão Supabase
const SUPABASE_URL = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Busca de fotos por nome ou CPF
async function searchFotos() {
  const termo = document.getElementById('searchInput').value.trim();
  const { data, error } = await supabase
    .from('formandos')
    .select('*')
    .or(`nome.ilike.%${termo}%,cpf.eq.${termo}`);

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (data && data.length > 0) {
    data.forEach(formando => {
      const container = document.createElement('div');
      container.innerHTML = `
        <h3>${formando.nome} - ${formando.cpf}</h3>
        <div class="galeria">
          ${formando.fotos.map(url => `<img src="${url}" class="foto">`).join('')}
        </div>
        <button onclick="exibirFormularioCompra('${formando.id}', 'digital')">Adquirir Álbum Digital (R$250)</button>
        <button onclick="exibirFormularioCompra('${formando.id}', 'fisico')">Adquirir Álbum Físico (R$330)</button>
        <button onclick="exibirFormularioCompra('${formando.id}', 'ambos')">Adquirir Ambos (R$470)</button>
      `;
      resultDiv.appendChild(container);
    });
  } else {
    resultDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
  }
}

// Exibe formulário de dados para compra
function exibirFormularioCompra(idFormando, tipoAlbum) {
  const formDiv = document.getElementById('compraForm');
  formDiv.innerHTML = `
    <h3>Preencha seus dados</h3>
    <input type="text" id="nomeCliente" placeholder="Seu nome">
    <input type="text" id="emailCliente" placeholder="Seu e-mail">
    <input type="text" id="enderecoCliente" placeholder="Endereço de entrega">
    <button onclick="salvarCompra('${idFormando}', '${tipoAlbum}')">Finalizar Pedido</button>
  `;
  formDiv.style.display = 'block';
}

// Salva compra no Supabase
async function salvarCompra(idFormando, tipoAlbum) {
  const nome = document.getElementById('nomeCliente').value.trim();
  const email = document.getElementById('emailCliente').value.trim();
  const endereco = document.getElementById('enderecoCliente').value.trim();

  const valores = {
    digital: 250,
    fisico: 330,
    ambos: 470
  };

  const { data, error } = await supabase
    .from('compras')
    .insert([{ nome, email, endereco, tipo_album: tipoAlbum, valor: valores[tipoAlbum], formando_id: idFormando }]);

  if (!error) {
    alert('Compra registrada! Você só será cobrado após o recebimento do álbum.');
    document.getElementById('compraForm').style.display = 'none';
  } else {
    alert('Erro ao registrar a compra.');
    console.error(error);
  }
  // Função para carregar e salvar fotos no Supabase Storage
async function uploadFotos(fotos) {
  const urlFotos = [];  // Cria um array vazio para armazenar as URLs das fotos

  // Loop para fazer o upload de todas as fotos selecionadas
  for (let i = 0; i < fotos.length; i++) {
    const foto = fotos[i];  // A foto selecionada
    const { data, error } = await supabase
      .storage
      .from('fotos')  // O bucket onde as fotos serão armazenadas
      .upload(foto.name, foto);  // Upload da foto

    // Se houver erro durante o upload, mostramos no console
    if (error) {
      console.error("Erro ao salvar foto:", error);
      return;
    }

    // Após o upload, obtemos a URL pública da foto
    const urlFoto = `${SUPABASE_URL}/storage/v1/object/public/fotos/${data.path}`;
    urlFotos.push(urlFoto);  // Adiciona a URL ao array urlFotos
  }

  return urlFotos;  // Retorna o array com todas as URLs das fotos
}
  
}

// Acesso ao painel com código 1811
function acessarPainel() {
  const codigo = prompt('Digite o código de acesso:');
  if (codigo === '1811') {
    window.location.href = 'admin.html';
  } else {
    alert('Código incorreto!');
  }
}
