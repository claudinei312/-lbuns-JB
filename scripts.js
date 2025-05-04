
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('codigoAcessoForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const codigo = document.getElementById('codigo').value;
  if (codigo === '1811') {
    document.getElementById('painel').style.display = 'block';
    this.style.display = 'none';
    carregarListaFormandos();
  } else {
    alert('Código incorreto!');
  }
});

document.getElementById('cadastroForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const fotos = document.getElementById('foto').files;
  const urls = [];

  for (let foto of fotos) {
    const { data, error } = await supabase.storage.from('fotos').upload(`fotos/${Date.now()}_${foto.name}`, foto);
    if (data) {
      const url = supabase.storage.from('fotos').getPublicUrl(data.path).data.publicUrl;
      urls.push(url);
    }
  }

  await supabase.from('formandos').insert([{ nome, cpf, fotos: urls }]);
  alert('Cadastro realizado com sucesso!');
  document.getElementById('cadastroForm').reset();
  carregarListaFormandos();
});

document.getElementById('buscaForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const busca = document.getElementById('busca').value.trim();
  const { data, error } = await supabase.from('formandos').select('*');
  const resultado = data.find(item => item.nome === busca || item.cpf === busca);

  const container = document.getElementById('resultados');
  container.innerHTML = '';
  document.getElementById('acoesCompra').style.display = 'none';

  if (resultado) {
    const titulo = document.createElement('h3');
    titulo.textContent = `${resultado.nome} - ${resultado.cpf}`;
    container.appendChild(titulo);

    resultado.fotos?.forEach(url => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `<input type="checkbox" class="selecionar-foto" value="${url}"><img src="${url}" width="150" />`;
      container.appendChild(wrapper);
    });

    if (resultado.fotos?.length) {
      document.getElementById('acoesCompra').style.display = 'block';
    }
  } else {
    container.textContent = 'Nenhum resultado encontrado.';
  }
});

function comprar(tipo) {
  const selecionadas = document.querySelectorAll('.selecionar-foto:checked');
  if (selecionadas.length === 0) return alert('Selecione ao menos uma foto.');
  const urls = Array.from(selecionadas).map(el => el.value);
  alert(`Você escolheu comprar o álbum ${tipo} com ${urls.length} fotos. O pagamento será realizado apenas após o recebimento do álbum.`);
}

async function carregarListaFormandos() {
  const { data, error } = await supabase.from('formandos').select('*');
  const tabela = document.querySelector('#listaFormandos tbody');
  tabela.innerHTML = '';
  data.forEach(item => {
    const linha = document.createElement('tr');
    linha.innerHTML = `<td>${item.nome}</td><td>${item.cpf}</td><td>${item.fotos?.length || 0}</td>`;
    tabela.appendChild(linha);
  });
}
