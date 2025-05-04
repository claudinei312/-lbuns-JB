// Função para verificar o código de acesso e redirecionar para o painel
function accessAdminPanel() {
    const code = document.getElementById("code").value;

    // Verificar se o código é o correto
    if (code === "1811") {
        window.location.href = "admin.html"; // Redireciona para o painel
    } else {
        alert("Código inválido. Tente novamente.");
    }
}

// Função de busca por nome ou CPF
function search() {
    const searchQuery = document.getElementById("search-input").value;

    // Conectar com Supabase para buscar dados
    fetchFromSupabase(searchQuery);
}

async function fetchFromSupabase(query) {
    const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
    const supabaseKey = 'YOUR_SUPABASE_KEY'; // Substitua pela sua chave
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('formandos')
        .select('name, cpf, photos')
        .ilike('name', `%${query}%`)
        .or(`cpf.eq.${query}`);

    if (error) {
        alert("Erro ao buscar dados.");
        return;
    }

    displayResults(data);
}

function displayResults(results) {
    let resultHTML = "";

    if (results.length > 0) {
        results.forEach(person => {
            resultHTML += `
                <div class="result">
                    <p><strong>${person.name}</strong></p>
                    <p>CPF: ${person.cpf}</p>
                    <button onclick="viewPhotos('${person.name}')">Ver Fotos</button>
                    <button onclick="showAlbumOptions('${person.name}')">Escolher Álbuns</button>
                </div>
            `;
        });
    } else {
        resultHTML = `<p>Nenhum resultado encontrado.</p>`;
    }

    document.getElementById("results").innerHTML = resultHTML;
}

function viewPhotos(personName) {
    // Função para exibir as fotos
    alert(`Exibindo fotos de ${personName}`);
}

// Função para registrar a compra
function registerPurchase(personName, albumType) {
    const formData = {
        name: personName,
        album: albumType,
        date: new Date().toISOString(),
    };

    // Aqui você deve gravar as informações no Supabase ou outro backend
    console.log("Dados de compra registrados: ", formData);

    // Exibir a confirmação de compra
    alert(`Compra registrada com sucesso para ${personName}. Tipo de álbum: ${albumType}`);
}

// Função para cadastrar fotos no Supabase
function uploadPhotos(files) {
    // Aqui você faria o upload das fotos para o Supabase
    console.log("Fotos carregadas com sucesso!");

    // Simulação de envio
    alert(`Fotos enviadas com sucesso!`);
}

// Função de visualização de múltiplas fotos e botão de compra
function showAlbumOptions(personName) {
    const optionsHTML = `
        <div class="album-options">
            <h3>Escolha o tipo de álbum para ${personName}</h3>
            <button onclick="registerPurchase('${personName}', 'Digital')">Comprar Álbum Digital - R$250</button>
            <button onclick="registerPurchase('${personName}', 'Físico')">Comprar Álbum Físico - R$330</button>
            <button onclick="registerPurchase('${personName}', 'Ambos')">Comprar Álbum Digital e Físico - R$470</button>
        </div>
    `;
    document.getElementById("results").innerHTML = optionsHTML;
}
