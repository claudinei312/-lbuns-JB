// Supabase config
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // substitua pela sua chave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Verificação de código do painel
function verificarCodigo() {
  const codigo = document.getElementById('codigoAcesso').value;
  if (codigo === '1811') {
    document.getElementById('loginPainel').style.display = 'none';
    document.getElementById('areaCadastro').style.display = 'block';
    carregarCadastros();
  } else {
    alert('Código incorreto!');
  }
}

// Cadastro de fotos
document.getElementById('formCadastro')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const fotos = document.getElementById('fotos').files;

  const urls = [];
  for (const file of fotos) {
    const filePath = `${cpf}/${file.name}`;
    const { data, error } = await supabase.storage.from('fotos').upload(filePath, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(filePath);
      urls.push(urlData.publicUrl);
    }
  }

  const { error: insertError } = await supabase.from('formandos').insert([{ nome, cpf, fotos: urls }]);
  if (insertError) {
    alert('Erro ao salvar cadastro.');
  } else {
    alert('Cadastro realizado!');
    document.getElementById('formCadastro').reset();
    carregarCadastros();
  }
});

// Carregar registros no painel
async function carregarCadastros() {
  const container = document.getElementById('listaCadastros');
  if (!container) return;
  container.innerHTML = '';
  const { data, error } = await supabase.from('formandos').select('*');
  if (data) {
    data.forEach((item) => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${item.nome}</strong> - CPF: ${item.cpf} - Fotos: ${item.fotos.length}`;
      container.appendChild(div);
    });
  }
}

// Busca na página inicial
document.getElementById('formBusca')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const termo = document.getElementById('busca').value.trim().toLowerCase();
  const { data } = await supabase.from('formandos').select('*');
  const resultados = data.filter(f => f.nome.toLowerCase().includes(termo) || f.cpf.includes(termo));

  const container = document.getElementById('resultadoBusca');
  container.innerHTML = '';

  if (resultados.length === 0) {
    container.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }

  resultados.forEach(formando => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${formando.nome} - CPF: ${formando.cpf}</h3>`;
    
    formando.fotos.forEach((url, i) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Foto ${i + 1}`;
      img.style.maxWidth = '150px';
      div.appendChild(img);
    });

    const btns = document.createElement('div');
    btns.innerHTML = `
      <button onclick="iniciarCompra('${formando.nome}', '${formando.cpf}', 'Digital', 250)">Adquirir álbum digital - R$250</button>
      <button onclick="iniciarCompra('${formando.nome}', '${formando.cpf}', 'Físico', 330)">Adquirir álbum físico - R$330</button>
      <button onclick="iniciarCompra('${formando.nome}', '${formando.cpf}', 'Ambos', 470)">Adquirir ambos - R$470</button>
    `;
    div.appendChild(btns);
    container.appendChild(div);
  });
});

// Início da compra
function iniciarCompra(nome, cpf, tipo, valor) {
  const dados = prompt(`Preencha seus dados para concluir a compra de álbum ${tipo} (R$${valor})\n\nDigite nome completo e endereço:`);
  if (dados) {
    registrarCompra(nome, cpf, tipo, valor, dados);
    alert('Dados recebidos! O pagamento será feito após o envio do álbum.');
  }
}

// Registro da compra no Supabase
async function registrarCompra(nome, cpf, tipo, valor, dadosContato) {
  await supabase.from('compras').insert([{ nome, cpf, tipo, valor, dados: dadosContato }]);
}
