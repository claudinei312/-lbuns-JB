const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const cpf = document.getElementById('cpf').value;
      const files = document.getElementById('fotos').files;

      const fotosUrls = [];
      for (const file of files) {
        const fileName = `${cpf}_${Date.now()}_${file.name}`;
        const { data, error } = await _supabase.storage.from('fotos').upload(fileName, file);
        if (error) {
          alert('Erro ao enviar foto: ' + error.message);
          return;
        }
        const { data: urlData } = _supabase.storage.from('fotos').getPublicUrl(fileName);
        fotosUrls.push(urlData.publicUrl);
      }

      const { error: insertError } = await _supabase.from('formandos').insert([
        { nome, cpf, fotos: fotosUrls }
      ]);

      if (insertError) {
        alert('Erro ao salvar no banco de dados: ' + insertError.message);
        return;
      }

      alert('Cadastro realizado com sucesso!');
      uploadForm.reset();
      mostrarFormandos();
    });

    mostrarFormandos();
  }
});

async function mostrarFormandos() {
  const lista = document.getElementById('listaFormandos');
  if (!lista) return;

  const { data, error } = await _supabase.from('formandos').select('*');
  if (error) {
    lista.innerHTML = 'Erro ao carregar dados.';
    return;
  }

  lista.innerHTML = data.map(formando => `
    <div class="card">
      <h3>${formando.nome}</h3>
      <p>CPF: ${formando.cpf}</p>
      <p>Fotos: ${formando.fotos?.length || 0}</p>
    </div>
  `).join('');
}

async function buscarFormando() {
  const termo = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultado = document.getElementById('resultadoBusca');
  resultado.innerHTML = 'Buscando...';

  const { data, error } = await _supabase.from('formandos').select('*');
  if (error || !data) {
    resultado.innerHTML = 'Erro na busca.';
    return;
  }

  const encontrados = data.filter(f => 
    f.nome.toLowerCase().includes(termo) || f.cpf.includes(termo)
  );

  if (encontrados.length === 0) {
    resultado.innerHTML = 'Nenhum resultado encontrado.';
    return;
  }

  resultado.innerHTML = encontrados.map(f => `
    <div class="card">
      <h3>${f.nome}</h3>
      ${f.fotos.map(url => `<img src="${url}" class="thumb" />`).join('')}
    </div>
  `).join('');
}
