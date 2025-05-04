const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY'; // Substitua pela sua chave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const resultSection = document.getElementById('resultSection');

  if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (searchTerm) {
        const { data, error } = await supabase
          .from('formandos')
          .select('*')
          .ilike('nome', `%${searchTerm}%`);

        if (error) {
          resultSection.innerHTML = '<p>Erro ao buscar formando.</p>';
        } else if (data.length === 0) {
          resultSection.innerHTML = '<p>Nenhum formando encontrado.</p>';
        } else {
          const formando = data[0];
          resultSection.innerHTML = `
            <h2>${formando.nome}</h2>
            <p>CPF: ${formando.cpf}</p>
            <img src="${formando.foto_url}" alt="Foto de ${formando.nome}" style="max-width: 200px">
            <br><br>
            <button onclick="comprarAlbum('${formando.cpf}')">Adquirir Álbum</button>
          `;
        }
      }
    });
  }
});

async function comprarAlbum(cpf) {
  const tipo = prompt('Escolha o tipo de álbum:\n1 - Digital (R$250)\n2 - Físico (R$330)\n3 - Ambos (R$470)');
  if (['1', '2', '3'].includes(tipo)) {
    let valor = tipo === '1' ? 250 : tipo === '2' ? 330 : 470;

    const nome = prompt('Digite seu nome completo:');
    const email = prompt('Digite seu e-mail para contato:');
    const endereco = prompt('Digite seu endereço para envio:');

    if (!nome || !email || !endereco) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    const { error } = await supabase
      .from('compras')
      .insert([{ cpf, tipo_album: tipo, valor, nome, email, endereco }]);

    if (error) {
      alert('Erro ao registrar a compra.');
    } else {
      alert('Compra registrada com sucesso. O pagamento será feito após o recebimento do álbum.');
    }
  } else {
    alert('Opção inválida!');
  }
}
