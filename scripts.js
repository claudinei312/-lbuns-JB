// === SUPABASE CONFIG ===
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// === CADASTRAR CLIENTE ===
async function addClient() {
  const name = document.getElementById("clientName").value;
  const cpf = document.getElementById("clientCPF").value;
  const fileInput = document.getElementById("albumPhotos");
  const file = fileInput.files[0];

  if (!file) {
    alert("Selecione uma foto.");
    return false;
  }

  const fileName = `${cpf}_${Date.now()}.${file.name.split('.').pop()}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("fotos")
    .upload(fileName, file);

  if (uploadError) {
    alert("Erro ao fazer upload da imagem.");
    console.error(uploadError);
    return false;
  }

  const photoUrl = `${supabaseUrl}/storage/v1/object/public/fotos/${fileName}`;

  const { error: insertError } = await supabase
    .from("formandos")
    .insert([{ name, cpf, photo_url: photoUrl }]);

  if (insertError) {
    alert("Erro ao salvar dados.");
    console.error(insertError);
    return false;
  }

  alert("Cliente cadastrado com sucesso!");
  document.querySelector("form").reset();
  loadClients();
  return false;
}

// === LISTAR CLIENTES NO PAINEL ===
async function loadClients() {
  const list = document.getElementById("orderList");
  if (!list) return;

  const { data, error } = await supabase
    .from("formandos")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Erro ao carregar dados:", error);
    return;
  }

  list.innerHTML = "";
  data.forEach(client => {
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${client.name}</strong> - CPF: ${client.cpf}<br>
      <img src="${client.photo_url}" alt="${client.name}" width="100" />
    `;
    list.appendChild(item);
  });
}

// === BUSCAR CLIENTE NA PÁGINA INICIAL ===
async function searchAlbum() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const { data, error } = await supabase
    .from("formandos")
    .select("*");

  if (error) {
    console.error("Erro na busca:", error);
    return;
  }

  const results = data.filter(client =>
    client.name.toLowerCase().includes(searchValue) ||
    client.cpf.includes(searchValue)
  );

  const albumsSection = document.getElementById("albums");
  albumsSection.innerHTML = "";

  if (results.length === 0) {
    albumsSection.innerHTML = "<p>Nenhum álbum encontrado.</p>";
    return;
  }

  results.forEach(client => {
    const albumDiv = document.createElement("div");
    albumDiv.classList.add("album");
    albumDiv.innerHTML = `
      <h3>${client.name}</h3>
      <img src="${client.photo_url}" alt="${client.name}" width="100" />
    `;
    albumsSection.appendChild(albumDiv);
  });
}

// === LOGIN SIMPLES ===
function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    window.location.href = "admin.html";
  } else {
    alert("Credenciais inválidas.");
  }
  return false;
}

// === INICIALIZA LISTA DE CLIENTES SE ESTIVER NO ADMIN ===
document.addEventListener("DOMContentLoaded", () => {
  loadClients();
});
