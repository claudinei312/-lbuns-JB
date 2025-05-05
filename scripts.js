const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78';
const database = supabase.createClient(supabaseUrl, supabaseKey);

// Função para login com código
function login() {
  const code = document.getElementById('accessCode').value;
  if (code === '1811') {
    window.location.href = 'admin.html';
  } else {
    alert('Código incorreto!');
  }
}

// Enviar cadastro
async function cadastrarFormando() {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const fotosInput = document.getElementById('fotos');
  const fotoFiles = fotosInput.files;

  if (!nome || !cpf || fotoFiles.length === 0) {
    alert('Preencha todos os campos e adicione ao menos uma foto.');
    return;
  }

  const fotoUrls = [];
  for (let i = 0; i < fotoFiles.length; i++) {
    const { data, error } = await database.storage
      .from('fotos')
      .upload(`${cpf}/${fotoFiles[i].name}`, fotoFiles[i], { upsert: true });
    if (data) {
      const url = `${supabaseUrl}/storage/v1/object/public/fotos/${cpf}/${fotoFiles[i].name}`;
      fotoUrls.push(url);
    }
  }

  const { error: insertError } = await database
    .from('formandos')
    .insert([{ nome, cpf, fotos: fotoUrls }]);

  if (insertError) {
    alert('Erro ao cadastrar.');
    console.error(insertError);
  } else {
    alert('Cadastro realizado!');
    document.getElementById('formCadastro').reset();
    listarFormandos();
  }
}

// Listar formandos no painel
async function listarFormandos() {
  const { data, error } = await database
    .from('formandos')
    .select('*')
    .order('nome', { ascending: true });

  const lista = document.getElementById('listaFormandos');
  lista.innerHTML = '';
  data.forEach(formando => {
    const item = document.createElement('div');
    item.innerHTML = `<strong>${formando.nome}</strong> - ${formando.cpf} - ${formando.fotos.length} fotos`;
    lista.appendChild(item);
  });
}

// Buscar fotos
async function buscarFotos() {
  const termo = document.getElementById('busca').value.trim().toLowerCase();
  const { data, error } = await database.from('formandos').select('*');

  const resultado = document.getElementById('resultadoBusca');
  resultado.innerHTML = '';

  const encontrado = data.find(
    f => f.nome.toLowerCase() === termo || f.cpf === termo
  );

  if (encontrado) {
    const titulo = document.createElement('h3');
    titulo.textContent = `${encontrado.nome} - ${encontrado.cpf}`;
    resultado.appendChild(titulo);

    encontrado.fotos.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Foto';
      img.style = 'max-width:150px;margin:5px;';
      resultado.appendChild(img);
    });
  } else {
    resultado.innerHTML = 'Nenhum registro encontrado.';
  }
}
