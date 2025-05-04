// Supabase
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Substitua pela sua chave completa
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Dados de acesso fixos
const adminEmail = "admin@jbformatura.com";
const adminSenha = "123456";

// Função de login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      if (email === adminEmail && senha === adminSenha) {
        localStorage.setItem("logado", "true");
        window.location.href = "painel.html";
      } else {
        alert("Email ou senha incorretos.");
      }
    });
  }

  // Verifica se está logado ao acessar painel.html
  const emPainel = window.location.pathname.includes("painel.html");
  if (emPainel && localStorage.getItem("logado") !== "true") {
    window.location.href = "login.html";
  }
});

  }
}

// Cadastro de formando
async function cadastrarFormando() {
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const fotoInput = document.getElementById('foto');
  const file = fotoInput.files[0];

  if (!nome || !cpf || !file) {
    alert("Preencha todos os campos.");
    return;
  }

  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('fotos')
    .upload(`${cpf}_${file.name}`, file);

  if (uploadError) {
    alert("Erro ao enviar foto.");
    return;
  }

  const fotoUrl = `${supabaseUrl}/storage/v1/object/public/fotos/${cpf}_${file.name}`;

  await supabase
    .from('formandos')
    .insert([{ nome, cpf, foto: fotoUrl }]);

  alert("Formando cadastrado com sucesso.");
  document.getElementById('nome').value = '';
  document.getElementById('cpf').value = '';
  document.getElementById('foto').value = '';
  carregarFormandos();
}

// Busca de formando na página inicial
async function searchFormando() {
  const termo = document.getElementById('searchInput').value.trim();
  const { data, error } = await supabase
    .from('formandos')
    .select('*')
    .or(`nome.ilike.%${termo}%,cpf.ilike.%${termo}%`);

  const container = document.getElementById('resultContainer');
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "Nenhum resultado encontrado.";
    return;
  }

  data.forEach(f => {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${f.nome} (${f.cpf})</h3><img src="${f.foto}" alt="Foto de ${f.nome}" width="200"/>`;
    container.appendChild(div);
  });
}

// Carrega formandos no painel
async function carregarFormandos() {
  const { data } = await supabase.from('formandos').select('*').order('nome');
  const lista = document.getElementById('listaFormandos');
  lista.innerHTML = "";
  data.forEach(f => {
    const div = document.createElement('div');
    div.innerHTML = `${f.nome} - ${f.cpf}`;
    lista.appendChild(div);
  });
}

// Executa ao abrir o painel
if (window.location.pathname.includes("painel.html")) {
  carregarFormandos();
}
