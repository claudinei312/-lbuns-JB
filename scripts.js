const SUPABASE_URL = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const SUPABASE_KEY = 'sua_chave_anonima'; // Coloque sua chave anônima aqui
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Função para cadastrar formando
async function cadastrarFormando() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const foto = document.getElementById('foto').files[0];

    // Carregar a foto para o Supabase Storage
    const { data, error } = await supabase.storage
        .from('fotos')
        .upload(`formando-${nome}-${cpf}.jpg`, foto);

    if (error) {
        alert('Erro ao carregar a foto');
        console.error(error);
        return;
    }

    // Salvar dados do formando no Supabase Database
    const { data: formandoData, error: dbError } = await supabase
        .from('formandos')
        .insert([
            {
                nome: nome,
                cpf: cpf,
                foto_url: data?.Key
            }
        ]);

    if (dbError) {
        alert('Erro ao cadastrar formando');
        console.error(dbError);
        return;
    }

    alert('Formando cadastrado com sucesso!');
    listarFormandos();
}

// Função para listar os formandos cadastrados
async function listarFormandos() {
    const { data: formandos, error } = await supabase
        .from('formandos')
        .select('nome, cpf, foto_url');

    if (error) {
        console.error('Erro ao listar formandos', error);
        return;
    }

    const list = document.getElementById('formandos-list');
    list.innerHTML = ''; // Limpar a lista atual

    formandos.forEach(formando => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${formando.nome}</strong><br>
            CPF: ${formando.cpf}<br>
            <img src="https://cdstzbtewwbwjqhvhigy.supabase.co/storage/v1/object/public/fotos/${formando.foto_url}" alt="Foto do Formando" width="100"><br><br>
        `;
        list.appendChild(listItem);
    });
}

// Chama a função listarFormandos ao carregar a página
document.addEventListener('DOMContentLoaded', listarFormandos);
