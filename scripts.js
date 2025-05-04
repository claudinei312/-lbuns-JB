// URL e chave do Supabase
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'your_supabase_key'; // substitua com a chave correta
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para verificar o código de acesso
function verificarAcesso() {
  const codigoAcesso = document.getElementById('codigoAcesso').value;
  const codigoCorreto = '1811'; // código de acesso
  if (codigoAcesso === codigoCorreto) {
    window.location.href = "admin.html"; // Redirecionar para o painel
  } else {
    alert('Código de acesso incorreto');
  }
}

// Função para cadastrar dados e fotos
async function cadastrarDados() {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const fotos = document.getElementById('fotos').files;

  // Verificar se as informações foram preenchidas
  if (!nome || !cpf || fotos.length === 0) {
    alert('Por favor, preencha todos os campos e selecione pelo menos uma foto.');
    return;
  }

  try {
    // Salvar os dados no banco de dados
    const { data, error } = await supabase
      .from('formandos')
      .insert([
        { nome, cpf }
      ]);

    if (error) throw error;

    // Fazer upload das fotos
    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i];
      const { data: fotoData, error: fotoError } = await supabase.storage
        .from('fotos')
        .upload(`fotos/${nome}_${cpf}_${i}`, foto);

      if (fotoError) throw fotoError;
    }

    alert('Cadastro realizado com sucesso!');
    mostrarResultados(); // Atualiza a lista de formandos após o cadastro

  } catch (error) {
    console.error(error.message);
    alert('Erro ao salvar os dados ou fotos.');
  }
}

// Função para mostrar os dados após cadastro
async function mostrarResultados() {
  const { data, error } = await supabase
    .from('formandos')
    .select('*');

  if (error) {
    console.error(error.message);
    return;
  }

  let resultadosHtml = '';
  for (let i = 0; i < data.length; i++) {
    const formando = data[i];
    resultadosHtml += `
      <div>
        <h3>${formando.nome} - CPF: ${formando.cpf}</h3>
        <button onclick="visualizarFotos('${formando.nome}', '${formando.cpf}')">Ver Fotos</button>
      </div>
    `;
  }
  document.getElementById('resultadoBusca').innerHTML = resultadosHtml;
}

// Função para exibir as fotos associadas ao nome e CPF
async function visualizarFotos(nome, cpf) {
  const { data, error } = await supabase
    .storage
    .from('fotos')
    .list(`fotos/${nome}_${cpf}`);

  if (error) {
    console.error(error.message);
    return;
  }

  let fotosHtml = '';
  for (let i = 0; i < data.length; i++) {
    const foto = data[i];
    const fotoUrl = supabase.storage.from('fotos').getPublicUrl(foto.name).publicURL;
    fotosHtml += `
      <img src="${fotoUrl}" alt="${nome}" style="width: 100px; height: 100px;">
    `;
  }

  document.getElementById('resultadoBusca').innerHTML = fotosHtml;
}

// Função de busca
document.getElementById('formBusca').addEventListener('submit', async (e) => {
  e.preventDefault();

  const termoBusca = document.getElementById('busca').value;

  if (!termoBusca) return;

  const { data, error } = await supabase
    .from('formandos')
    .select('*')
    .ilike('nome', `%${termoBusca}%`)
    .or(`cpf.eq.${termoBusca}`);

  if (error) {
    console.error(error.message);
    return;
  }

  let resultadosHtml = '';
  for (let i = 0; i < data.length; i++) {
    const formando = data[i];
    resultadosHtml += `
      <div>
        <h3>${formando.nome} - CPF: ${formando.cpf}</h3>
        <button onclick="visualizarFotos('${formando.nome}', '${formando.cpf}')">Ver Fotos</button>
      </div>
    `;
  }
  document.getElementById('resultadoBusca').innerHTML = resultadosHtml;
});
