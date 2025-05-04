// Configuração do Supabase
const supabaseUrl = 'https://cdstzbtewwbwjqhvhigy.supabase.co'
const supabaseKey = 'YOUR_SUPABASE_KEY' // Substitua com a chave correta
const supabase = createClient(supabaseUrl, supabaseKey)

// Função para cadastrar as fotos
async function cadastrarFotos() {
  const nome = document.getElementById('nome').value
  const cpf = document.getElementById('cpf').value
  const files = document.getElementById('fotos').files
  const fotos = []

  // Fazer upload das fotos para o Supabase
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const { data, error } = await supabase.storage
      .from('fotos')
      .upload(`${cpf}/${file.name}`, file)

    if (error) {
      console.error(error)
    } else {
      fotos.push(data.path) // Salvar caminho da foto
    }
  }

  // Salvar dados no banco de dados
  const { error } = await supabase.from('pessoas').insert([
    {
      nome: nome,
      cpf: cpf,
      fotos: fotos
    }
  ])

  if (error) {
    console.error(error)
  } else {
    alert('Cadastro realizado com sucesso!')
    location.reload() // Atualizar a página
  }
}

// Função para realizar a busca de fotos
async function buscarFotos() {
  const pesquisa = document.getElementById('pesquisa').value
  const { data, error } = await supabase
    .from('pessoas')
    .select('*')
    .ilike('nome', `%${pesquisa}%`)
    .or(`cpf.eq.${pesquisa}`) // Permitir busca por CPF também

  if (error) {
    console.error(error)
  } else {
    const resultadosDiv = document.getElementById('resultados')
    resultadosDiv.innerHTML = ''

    // Exibir os resultados da busca
    data.forEach((pessoa) => {
      const div = document.createElement('div')
      div.classList.add('pessoa')
      div.innerHTML = `
        <h3>${pessoa.nome} (CPF: ${pessoa.cpf})</h3>
        <p>Fotos: ${pessoa.fotos.length}</p>
        <button onclick="exibirFotos('${pessoa.cpf}')">Ver Fotos</button>
        <br><br>
        <button onclick="comprarAlbum('${pessoa.cpf}', 'digital')">Adquirir Álbum Digital (R$ 250)</button>
        <button onclick="comprarAlbum('${pessoa.cpf}', 'fisico')">Adquirir Álbum Físico (R$ 330)</button>
        <button onclick="comprarAlbum('${pessoa.cpf}', 'ambos')">Adquirir Ambos (R$ 470)</button>
      `
      resultadosDiv.appendChild(div)
    })
  }
}

// Função para exibir as fotos
async function exibirFotos(cpf) {
  const { data, error } = await supabase
    .from('pessoas')
    .select('fotos')
    .eq('cpf', cpf)
    .single()

  if (error) {
    console.error(error)
  } else {
    const fotosDiv = document.getElementById('fotosExibidas')
    fotosDiv.innerHTML = ''
    data.fotos.forEach((foto) => {
      const img = document.createElement('img')
      img.src = `https://cdstzbtewwbwjqhvhigy.supabase.co/storage/v1/object/public/fotos/${foto}`
      img.alt = 'Foto do Formando'
      img.style.width = '200px'
      fotosDiv.appendChild(img)
    })
  }
}

// Função para realizar a compra do álbum
async function comprarAlbum(cpf, tipo) {
  const { data, error } = await supabase
    .from('pessoas')
    .select('*')
    .eq('cpf', cpf)
    .single()

  if (error) {
    console.error(error)
  } else {
    const preco = tipo === 'digital' ? 250 : tipo === 'fisico' ? 330 : 470

    const compraData = {
      cpf: data.cpf,
      nome: data.nome,
      tipo: tipo,
      preco: preco
    }

    const { insertError } = await supabase.from('compras').insert([compraData])

    if (insertError) {
      console.error(insertError)
    } else {
      alert(`Compra registrada com sucesso! Valor: R$ ${preco}`)
      location.reload() // Atualizar a página
    }
  }
}
