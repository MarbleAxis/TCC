const inputNovaTarefa = document.querySelector('#inputNovaTarefa')
const btnAddTarefa = document.querySelector('#btnAddTarefa')
const listaTarefas = document.querySelector('#listaTarefas')
const janelaEdicao = document.querySelector('#janelaEdicao')
const janelaEdicaoFundo = document.querySelector('#janelaEdicaoFundo')
const janelaEdicaoBtnFechar = document.querySelector('#janelaEdicaoBtnFechar')
const btnAtualizarTarefa = document.querySelector('#btnAtualizarTarefa')
const idTarefaEdicao = document.querySelector('#idTarefaEdicao')
const inputTarefaNomeEdicao = document.querySelector('#inputTarefaNomeEdicao')
const qtdIdsDisponiveis = Number.MAX_VALUE
const KEY_CODE_ENTER = 13
const KEY_LOCAL_STORAGE = 'listaDeTarefas'
let dbTarefas = []

obterTarefasLocalStorage()
renderizarListaTarefaHtml()

inputNovaTarefa.addEventListener('keypress', (e) => {
  if (e.keyCode === KEY_CODE_ENTER) {
    const tarefa = {
      nome: inputNovaTarefa.value,
      id: gerarIdV2()
    }
    adicionarTarefa(tarefa)
  }
})

janelaEdicaoBtnFechar.addEventListener('click', (e) => {
  alternarJanelaEdicao()
})

btnAddTarefa.addEventListener('click', (e) => {
  const tarefa = {
    nome: inputNovaTarefa.value,
    id: gerarIdV2()
  }
  adicionarTarefa(tarefa)
})

btnAtualizarTarefa.addEventListener('click', (e) => {
  e.preventDefault()

  const idTarefa = idTarefaEdicao.innerHTML.replace('#', '')

  const tarefa = {
    nome: inputTarefaNomeEdicao.value,
    id: idTarefa
  }

  const tarefaAtual = document.getElementById('' + idTarefa + '')

  if (tarefaAtual) {
    const indiceTarefa = obterIndiceTarefaPorId(idTarefa)
    dbTarefas[indiceTarefa] = tarefa
    salvarTarefasLocalStorage()

    const li = criarTagLI(tarefa)
    listaTarefas.replaceChild(li, tarefaAtual)
    alternarJanelaEdicao()
  } else {
    alert('Elemento HTML não encontrado!')
  }
})

function gerarId () {
  return Math.floor(Math.random() * qtdIdsDisponiveis)
}

function gerarIdV2 () {
  return gerarIdUnico()
}

function gerarIdUnico () {
  // debugger;
  const itensDaLista = document.querySelector('#listaTarefas').children
  const idsGerados = []

  for (let i = 0; i < itensDaLista.length; i++) {
    idsGerados.push(itensDaLista[i].id)
  }

  let contadorIds = 0
  let id = gerarId()

  while (contadorIds <= qtdIdsDisponiveis &&
        idsGerados.indexOf(id.toString()) > -1) {
    id = gerarId()
    contadorIds++

    if (contadorIds >= qtdIdsDisponiveis) {
      alert('Oops, ficamos sem IDS :/')
      throw new Error('Acabou os IDs :/')
    }
  }

  return id
}

function adicionarTarefa (tarefa) {
  dbTarefas.push(tarefa)
  salvarTarefasLocalStorage(dbTarefas)
  renderizarListaTarefaHtml()
}

function criarTagLI (tarefa) {
  const li = document.createElement('li')
  li.id = tarefa.id

  const span = document.createElement('span')
  span.classList.add('textoTarefa')
  span.innerHTML = tarefa.nome

  const div = document.createElement('div')

  const btnEditar = document.createElement('button')
  btnEditar.classList.add('btnAcao')
  btnEditar.innerHTML = '<i class="fa fa-pencil"></i>'
  btnEditar.setAttribute('onclick', 'editar(' + tarefa.id + ')')

  const btnExcluir = document.createElement('button')
  btnExcluir.classList.add('btnAcao')
  btnExcluir.innerHTML = '<i class="fa fa-trash"></i>'
  btnExcluir.setAttribute('onclick', 'excluir(' + tarefa.id + ')')

  div.appendChild(btnEditar)
  div.appendChild(btnExcluir)

  li.appendChild(span)
  li.appendChild(div)
  return li
}

function editar (idTarefa) {
  const li = document.getElementById('' + idTarefa + '')
  if (li) {
    idTarefaEdicao.innerHTML = '#' + idTarefa
    inputTarefaNomeEdicao.value = li.innerText
    alternarJanelaEdicao()
  } else {
    alert('Elemento HTML não encontrado!')
  }
}

function excluir (idTarefa) {
  const confirmacao = window.confirm('Tem certeza que deseja excluir? ')
  if (confirmacao) {
    const indiceTarefa = obterIndiceTarefaPorId(idTarefa)
    dbTarefas.splice(indiceTarefa, 1)
    salvarTarefasLocalStorage()

    const li = document.getElementById('' + idTarefa + '')
    if (li) {
      listaTarefas.removeChild(li)
    } else {
      alert('Elemento HTML não encontrado!')
    }
  }
}

function alternarJanelaEdicao () {
  janelaEdicao.classList.toggle('abrir')
  janelaEdicaoFundo.classList.toggle('abrir')
}

function obterIndiceTarefaPorId (idTarefa) {
  const indiceTarefa = dbTarefas.findIndex(t => t.id == idTarefa)
  if (indiceTarefa < 0) {
    throw new Error('Id da tarefa não encontrado: ', idTarefa)
  }
  return indiceTarefa
}

function renderizarListaTarefaHtml () {
  listaTarefas.innerHTML = ''
  for (let i = 0; i < dbTarefas.length; i++) {
    const li = criarTagLI(dbTarefas[i])
    listaTarefas.appendChild(li)
  }
  inputNovaTarefa.value = ''
}

function salvarTarefasLocalStorage () {
  localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(dbTarefas))
}

function obterTarefasLocalStorage () {
  if (localStorage.getItem(KEY_LOCAL_STORAGE)) {
    dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE))
  }
}
