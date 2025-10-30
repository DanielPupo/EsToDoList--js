// =============================================================
//  EsToDoList - CRUD básico de tarefas
//  Autor: Daniel Pupo de Morais Santos (Adaptado do Prof. Rafael Ribas)
//  Objetivo: Implementar as funcionalidades de ToDo List com Clean Code
// =============================================================

// -------------------------------
// 1. Selecionar os elementos da página (DOM Cache)
// -------------------------------
const campoNovaTarefa = document.getElementById('nova-tarefa-input')
const botaoAdicionar = document.getElementById('adicionar-btn')
const listaTarefas = document.getElementById('lista-de-tarefas')
const campoPesquisa = document.getElementById('pesquisa-input')
const seletorFiltro = document.getElementById('filtro-select')

// Array principal que armazenará todas as tarefas
let tarefas = []

// -------------------------------
// 2. Carregar tarefas salvas no navegador (localStorage)
// -------------------------------
function carregarTarefasSalvas() {
  // Tenta buscar o item 'tarefas' no localStorage
  const tarefasSalvas = localStorage.getItem('tarefas')
  if (tarefasSalvas) {
    // Se existir, converte a string JSON salva de volta para um array de objetos
    tarefas = JSON.parse(tarefasSalvas)
    // Exibe as tarefas carregadas na tela
    exibirTarefas(tarefas)
  }
}

// -------------------------------
// 3. Salvar as tarefas no navegador
// -------------------------------
function salvarTarefas() {
  // Converte o array de tarefas para uma string JSON e salva no localStorage
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// -------------------------------
// 4. Função para adicionar uma nova tarefa
// -------------------------------
function adicionarTarefa() {
  const texto = campoNovaTarefa.value.trim() // Pega o valor e remove espaços em branco extras

  // Validação: não permite tarefas vazias
  if (texto === '') {
    alert('Digite uma tarefa antes de adicionar!')
    return
  }

  // Criamos um objeto padronizado representando a nova tarefa
  const novaTarefa = {
    id: Date.now(), // ID único baseado no timestamp atual
    texto: texto,
    concluida: false
  }

  // Adicionamos ao array principal e persistimos no armazenamento local
  tarefas.push(novaTarefa)
  salvarTarefas()

  // Atualizamos a lista exibida (incluindo o novo item)
  exibirTarefas(tarefas)

  // Limpamos o campo de texto após a adição
  campoNovaTarefa.value = ''
}

// -------------------------------
// 5. Função para exibir as tarefas na tela (Renderização)
// -------------------------------
function exibirTarefas(listaParaMostrar) {
  // Limpamos o conteúdo atual da lista para evitar duplicatas
  listaTarefas.innerHTML = ''

  // Percorremos o array de tarefas a ser exibido
  for (let tarefa of listaParaMostrar) {
    // 1. Cria o elemento principal da lista (<li>)
    const item = document.createElement('li')
    item.className = 'flex justify-between items-center p-3 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition'

    // Aplica a classe visual 'concluida' se o status for true
    if (tarefa.concluida) {
      item.classList.add('concluida')
    }

    // 2. Cria o span para o texto e configura o evento de alternância (concluir/ativar)
    const textoTarefa = document.createElement('span')
    textoTarefa.textContent = tarefa.texto
    textoTarefa.className = 'tarefa-texto flex-grow cursor-pointer'
    textoTarefa.onclick = function () {
      alternarConclusao(tarefa.id) // Chama a função passando o ID da tarefa
    }

    // 3. Container para os botões de ação
    const botoes = document.createElement('div')
    botoes.className = 'flex space-x-2'

    // 3a. Botão de Editar
    const botaoEditar = document.createElement('button')
    botaoEditar.textContent = '✏️'
    botaoEditar.className = 'px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded'
    botaoEditar.onclick = function () {
      editarTarefa(tarefa.id) // Chama a função passando o ID da tarefa
    }

    // 3b. Botão de Excluir
    const botaoExcluir = document.createElement('button')
    botaoExcluir.textContent = '🗑️'
    botaoExcluir.className = 'px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded'
    botaoExcluir.onclick = function () {
      excluirTarefa(tarefa.id) // Chama a função passando o ID da tarefa
    }

    // 4. Monta a estrutura do <li>
    botoes.appendChild(botaoEditar)
    botoes.appendChild(botaoExcluir)
    item.appendChild(textoTarefa)
    item.appendChild(botoes)

    // 5. Adiciona o <li> completo à lista principal no DOM
    listaTarefas.appendChild(item)
  }
}

// -------------------------------
// 6. Função para alternar entre concluída e ativa
// -------------------------------
function alternarConclusao(id) {
  // Encontra a tarefa pelo ID e inverte o seu status
  for (let tarefa of tarefas) {
    if (tarefa.id === id) {
      tarefa.concluida = !tarefa.concluida
      break // Otimização: para o loop assim que encontrar
    }
  }
  salvarTarefas()     // Persiste a mudança
  exibirTarefas(tarefas) // Re-renderiza a lista (mantendo filtros, se houver)
}

// -------------------------------
// 7. Função para editar o texto de uma tarefa
// -------------------------------
function editarTarefa(id) {
  const novaDescricao = prompt('Edite a tarefa:')

  // Verifica se o usuário cancelou (null) ou deixou em branco
  if (novaDescricao === null || novaDescricao.trim() === '') {
    return
  }

  // Encontra a tarefa pelo ID e atualiza o texto
  for (let tarefa of tarefas) {
    if (tarefa.id === id) {
      tarefa.texto = novaDescricao.trim()
      break // Otimização: para o loop assim que encontrar
    }
  }

  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 8. Função para excluir uma tarefa
// -------------------------------
function excluirTarefa(id) {
  const confirmar = window.confirm('Tem certeza que deseja excluir esta tarefa?')

  if (confirmar) {
    // Cria um novo array, filtrando e removendo a tarefa com o ID fornecido
    tarefas = tarefas.filter(function (tarefa) {
      return tarefa.id !== id
    })
    salvarTarefas()
    exibirTarefas(tarefas)
  }
}

// -------------------------------
// 9. Função de pesquisa (filtro de texto)
// -------------------------------
function pesquisarTarefas() {
  const termo = campoPesquisa.value.toLowerCase() // Pega o texto e converte para minúsculo
  // Filtra as tarefas cujo texto contém o termo de pesquisa
  const filtradas = tarefas.filter(function (tarefa) {
    return tarefa.texto.toLowerCase().includes(termo)
  })
  exibirTarefas(filtradas)
}

// -------------------------------
// 10. Filtro: todos / ativos / concluídos
// -------------------------------
function filtrarTarefas() {
  const tipo = seletorFiltro.value // Pega o valor selecionado (todos, ativos, concluídos)
  let filtradas = []

  if (tipo === 'todos') {
    filtradas = tarefas // Mostra o array completo
  } else if (tipo === 'ativos') {
    // Filtra apenas as tarefas onde 'concluida' é false
    filtradas = tarefas.filter(tarefa => !tarefa.concluida)
  } else if (tipo === 'concluidos') {
    // Filtra apenas as tarefas onde 'concluida' é true
    filtradas = tarefas.filter(tarefa => tarefa.concluida)
  }

  exibirTarefas(filtradas)
}

// -------------------------------
// 11. Eventos (interações do usuário)
// -------------------------------
// Ações disparadas por clique/alteração
botaoAdicionar.addEventListener('click', adicionarTarefa)
campoPesquisa.addEventListener('input', pesquisarTarefas) // 'input' dispara a cada tecla digitada
seletorFiltro.addEventListener('change', filtrarTarefas)

// -------------------------------
// 12. Permitir adicionar tarefa ao pressionar Enter no campo de input
// -------------------------------
campoNovaTarefa.addEventListener('keydown', function (evento) {
  // Verifica se a tecla pressionada foi "Enter" (código 'Enter')
  if (evento.key === 'Enter') {
    adicionarTarefa()
  }
})

// -------------------------------
// 13. Inicialização: Quando a página carregar, buscamos as tarefas salvas
// -------------------------------
window.onload = carregarTarefasSalvas