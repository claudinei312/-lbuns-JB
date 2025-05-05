// Inicializa o Supabase
const _supabase = supabase.createClient(
  "https://cdstzbtewwbwjqhvhigy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78"
);

// Cadastro de novo formando
async function cadastrarFormando() {
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const fotos = document.getElementById("fotos").files;

  if (!nome || !cpf || fotos.length === 0) {
    alert("Preencha todos os campos e selecione pelo menos uma foto.");
    return;
  }

  const fotosUrls = [];

  for (const file of fotos) {
    const fileName = `${cpf}_${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await _supabase.storage.from('fotos').upload(fileName, file);

    if (uploadError) {
      console.error("Erro ao enviar foto:", uploadError);
      alert("Erro ao enviar foto.");
      return;
    }

    const { data: urlData } = _supabase.storage.from('fotos').getPublicUrl(fileName);
    if (!urlData || !urlData.publicUrl) {
      console.error("Erro ao gerar URL pública:", urlData);
      alert("Erro ao gerar URL da foto.");
      return;
    }

    fotosUrls.push(urlData.publicUrl);
  }

  console.log("URLs das fotos:", fotosUrls);

  const { error: insertError } = await _supabase.from('formandos').insert([{ nome, cpf, fotos: fotosUrls }]);

  if (insertError) {
    console.error("Erro ao salvar no banco:", insertError);
    alert("Erro ao salvar dados no banco.");
    return;
  }

  alert("Cadastro realizado com sucesso!");
  document.getElementById("formCadastro").reset();
  listarFormandos(); // Atualiza a lista abaixo do formulário, se aplicável
}
