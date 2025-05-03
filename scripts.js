const supabaseUrl = "https://cdstzbtewwbwjqhvhigy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78";
const supabase = supabasejs.createClient(supabaseUrl, supabaseKey);

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email === "admin@jb.com" && password === "123456") {
        window.location.href = "painel.html";
    } else {
        alert("Credenciais inválidas.");
    }
    return false;
}

async function addClient() {
    const name = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCPF").value;
    const photo = document.getElementById("photoFile").files[0];
    const filePath = `fotos/${cpf}_${photo.name}`;
    const { error: uploadError } = await supabase.storage.from("jb-formatura").upload(filePath, photo);
    if (uploadError) {
        alert("Erro ao enviar foto.");
        return false;
    }

    const { error: insertError } = await supabase.from("alunos").insert({ name, cpf, photo: filePath });
    if (insertError) {
        alert("Erro ao salvar os dados.");
        return false;
    }

    alert("Cadastro realizado com sucesso!");
    return false;
}

async function searchAlbum() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const { data, error } = await supabase.from("alunos").select("*");
    if (error) {
        alert("Erro ao buscar dados.");
        return;
    }

    const results = data.filter(album =>
        album.name.toLowerCase().includes(searchValue) || album.cpf.includes(searchValue)
    );
    const albumsSection = document.getElementById("albums");
    albumsSection.innerHTML = "";

    for (const album of results) {
        const { data: photoData } = supabase.storage.from("jb-formatura").getPublicUrl(album.photo);
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${album.name}</h3>
            <p>CPF: ${album.cpf}</p>
            <img src="${photoData.publicUrl}" width="200" />
        `;
        albumsSection.appendChild(div);
    }
}
