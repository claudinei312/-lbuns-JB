// Supabase config
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc3R6YnRld3did2pxaHZoaWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTk1MzMsImV4cCI6MjA2MTg3NTUzM30.CSUSb1NFFjf2MYLjPjiOS-RZdvavTxeqr_-T74Lum78';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Login
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const validEmail = "admin@jb.com";
    const validPassword = "123456";

    if (email === validEmail && password === validPassword) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "painel.html";
        return false;
    } else {
        document.getElementById("error").textContent = "E-mail ou senha inválidos.";
        return false;
    }
}

// Protege o painel
function verificarLogin() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
    }
}

// Cadastro
async function cadastrar(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const file = document.getElementById("foto").files[0];

    if (!nome || !cpf || !file) {
        alert("Preencha todos os campos.");
        return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${cpf}_${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('fotos')
        .upload(fileName, file);

    if (uploadError) {
        alert("Erro ao enviar imagem: " + uploadError.message);
        return;
    }

    const fotoUrl = `${supabaseUrl}/storage/v1/object/public/fotos/${fileName}`;

    const { error: insertError } = await supabase
        .from('formandos')
        .insert([{ nome, cpf, foto_url: fotoUrl }]);

    if (insertError) {
        alert("Erro ao salvar dados: " + insertError.message);
        return;
    }

    alert("Cadastro realizado com sucesso!");
    document.getElementById("formCadastro").reset();
}

// Busca
async function buscar(event) {
    event.preventDefault();
    const termo = document.getElementById("busca").value.trim().toLowerCase();
    const { data, error } = await supabase.from('formandos').select('*');

    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";

    if (error) {
        resultado.innerHTML = "<p>Erro ao buscar dados.</p>";
        return;
    }

    const filtrados = data.filter(f =>
        f.nome.toLowerCase().includes(termo) || f.cpf.includes(termo)
    );

    if (filtrados.length === 0) {
        resultado.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    filtrados.forEach(f => {
        const item = document.createElement("div");
        item.innerHTML = `
            <p><strong>Nome:</strong> ${f.nome}</p>
            <p><strong>CPF:</strong> ${f.cpf}</p>
            <img src="${f.foto_url}" alt="Foto de ${f.nome}" width="200" />
            <hr/>
        `;
        resultado.appendChild(item);
    });
}
