// script.js (atualizado: sem campo de busca por nome, botão limpar adicionado)
let servicos = [];
let servicosFiltrados = []; // guarda o resultado da última filtragem por categoria

// Carrega os dados da API Flask
async function carregarDados() {
    try {
        const response = await fetch("https://grafica-backend-x68u.onrender.com/api/servicos");
        servicos = await response.json();
        preencherCategorias();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

// Preenche o select de categorias
function preencherCategorias() {
    const categoriaSelect = document.getElementById("categoria");

    // gera o set de categorias sem o valor "Categoria"
    const categorias = Array.from(
      new Set(
        servicos
          .map(s => s.categoria)
          .filter(c => c && c.toUpperCase() !== "CATEGORIA")
      )
    );

    // limpa e adiciona manualmente a opção "Todos"
    categoriaSelect.innerHTML = '';
    const optTodos = document.createElement("option");
    optTodos.value = "";
    optTodos.textContent = "Todos";
    categoriaSelect.appendChild(optTodos);

    // adiciona as categorias reais
    categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoriaSelect.appendChild(option);
    });
}


function atualizarDescricao() {
    const categoria = document.getElementById("categoria").value;
    const descricaoSelect = document.getElementById("descricao");

    servicosFiltrados = categoria
        ? servicos.filter(s => s.categoria === categoria)
        : servicos;

    const descricoes = Array.from(new Set(servicosFiltrados.map(s => s.descricao).filter(d => d)));
    descricaoSelect.innerHTML = '<option value="">Todos</option>';
    descricoes.forEach(desc => {
        const option = document.createElement("option");
        option.value = desc;
        option.textContent = desc;
        descricaoSelect.appendChild(option);
    });

    atualizarCamposDependentes();
}

function atualizarCamposDependentes() {
    const descricao = document.getElementById("descricao").value;
    const tamSelect = document.getElementById("tam");
    const coresSelect = document.getElementById("cores");
    const qtdeSelect = document.getElementById("qtde");

    const base = descricao
        ? servicosFiltrados.filter(s => s.descricao === descricao)
        : servicosFiltrados;

    popularSelect(tamSelect, new Set(base.map(s => s.tam).filter(v => v)));
    popularSelect(coresSelect, new Set(base.map(s => s.cores).filter(v => v)));
    popularSelect(qtdeSelect, new Set(base.map(s => s.qtde).filter(v => v)));
}

function popularSelect(selectElement, valuesSet) {
    selectElement.innerHTML = '<option value="">Todos</option>';
    valuesSet.forEach(valor => {
        const option = document.createElement("option");
        option.value = valor;
        option.textContent = valor;
        selectElement.appendChild(option);
    });
}

function aplicarFiltros() {
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao").value;
    const tam = document.getElementById("tam").value;
    const cores = document.getElementById("cores").value;
    const qtde = document.getElementById("qtde").value;
    const comissao = parseFloat(document.getElementById("comissao").value) || 0;

    const tbody = document.querySelector("#tabela-servicos tbody");
    tbody.innerHTML = "";

    const resultados = servicos.filter(item => {
        const matchCategoria = !categoria || item.categoria === categoria;
        const matchDescricao = !descricao || item.descricao === descricao;
        const matchTam = !tam || item.tam === tam;
        const matchCores = !cores || item.cores === cores;
        const matchQtde = !qtde || item.qtde == qtde;
        return matchCategoria && matchDescricao && matchTam && matchCores && matchQtde;
    });

    resultados.forEach(item => {
        const precoFinal = item.preco + (item.preco * comissao / 100);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.categoria}</td>
            <td>${item.descricao}</td>
            <td>${item.cores}</td>
            <td>${item.qtde}</td>
            <td>${item.tam}</td>
            <td>${item.prazo}</td>
            <td>R$ ${precoFinal.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

function limparCampos() {
    document.getElementById("categoria").value = "";
    atualizarDescricao();
    document.getElementById("descricao").value = "";
    document.getElementById("tam").value = "";
    document.getElementById("cores").value = "";
    document.getElementById("qtde").value = "";
    document.getElementById("comissao").value = "";
    // Limpa a tabela de resultados
    const tbody = document.querySelector("#tabela-servicos tbody");
    tbody.innerHTML = "";
}

function calcularM2() {
    let largura = parseFloat(document.getElementById("largura").value);
    let altura = parseFloat(document.getElementById("altura").value);
    const unidadeLargura = document.getElementById("unidade-largura").value;
    const unidadeAltura = document.getElementById("unidade-altura").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const valor = parseFloat(document.getElementById("valor").value);

    if (unidadeLargura === "cm") largura /= 100;
    if (unidadeAltura === "cm") altura /= 100;

    const m2 = largura * altura * quantidade;
    const total = m2 * valor;

    document.getElementById("resultado-m2").textContent = `R$ ${total.toFixed(2)}`;
}

// Eventos
window.onload = carregarDados;
document.getElementById("categoria").addEventListener("change", atualizarDescricao);
document.getElementById("descricao").addEventListener("change", atualizarCamposDependentes);
document.getElementById("pesquisar-btn").addEventListener("click", aplicarFiltros);
document.getElementById("limpar-btn").addEventListener("click", limparCampos);
document.getElementById("calcular-btn").addEventListener("click", calcularM2);
