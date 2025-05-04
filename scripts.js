const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIs...'; // substitua pela sua chave pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let fotosSelecionadas = [];
let tipoCompraSelecionado = '';

async function buscarFotos() {
  const termo = document.getElementById('busca').value.trim().toLowerCase();
  if (!termo) return;

  const { data, error } = await supabase
    .from('formandos')
    .select('*')
    .or(`nome.ilike.%${termo}%,cpf.ilike.%${termo}%`);

  const resultados = document.getElementById('resultados');
  resultados.innerHTML = '';

  if (error || !data || data.length === 0) {
    resultados.innerHTML = '<p>Nenhuma foto encontrada.</p>';
    return;
  }

  data.forEach(pessoa => {
    const container = document.createElement('div');
    container.className = 'aluno-container';

    const nome = document.createElement('h3');
    nome.textContent = `${pessoa.nome} - ${pessoa.cpf}`;
    container.appendChild(nome);

    if (pessoa.fotos && pessoa.fotos.length > 0) {
      pessoa.fotos.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Foto ${index + 1}`;
        img.className = 'foto-aluno';
        img.onclick = () => selecionarFoto(url);
        container.appendChild(img);
      });

      // Botões de compra
      const botoes = document.createElement('div');
      botoes.innerHTML = `
        <p><strong>Escolha uma opção de álbum:</strong></p>
        <button onclick="mostrarFormularioCompra('digital')">Adquirir Álbum Digital - R$250,00</button>
        <button onclick="mostrarFormularioCompra('fisico')">Adquirir Álbum Físico - R$330,00</button>
        <button onclick="mostrarFormularioCompra('ambos')">Adquirir Álbum Digital + Físico - R$470,00</button>
        <p style="color:red;"><strong>O pagamento só será feito após o recebimento do álbum.</strong></p>
      `;
      container.appendChild(botoes);
    } else {
      container.innerHTML += '<p>Nenhuma foto cadastrada.</p>';
    }

    resultados.appendChild(container);
  });
}

function selecionarFoto(url) {
  if (!fotosSelecionadas.includes(url)) {
    fotosSelecionadas.push(url);
  }
}

function mostrarFormularioCompra(tipo) {
  tipoCompraSelecionado = tipo;
  document.getElementById('formularioCompra').style.display = 'block';
}

async function finalizarCompra() {
  const nome = document.getElementById('nomeComprador').value.trim();
  const cpf = document.getElementById('cpfComprador').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const contato = document.getElementById('contato').value.trim();

  if (!nome || !cpf || !endereco || !contato || !tipoCompraSelecionado) {
    alert('Preencha todos os campos.');
    return;
  }

  const compra = {
    nome,
    cpf,
    endereco,
    contato,
    fotos: fotosSelecionadas,
    tipo: tipoCompraSelecionado,
    valor: tipoCompraSelecionado === 'digital' ? 250 :
           tipoCompraSelecionado === 'fisico' ? 330 : 470,
    data: new Date().toISOString()
  };

  const { error } = await supabase.from('compras').insert([compra]);

  if (error) {
    alert('Erro ao registrar compra.');
  } else {
    alert('Compra registrada! Em breve entraremos em contato.');
    document.getElementById('formularioCompra').style.display = 'none';
  }
}
