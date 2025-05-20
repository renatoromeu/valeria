async function carregarDados() {
    const resposta = await fetch('dados.json');
    const dados = await resposta.json();
  
    // Frase motivacional aleatória
    const frase = dados.frases[Math.floor(Math.random() * dados.frases.length)];
    document.getElementById("motivacional").textContent = frase;
  
    // Datas
    const hoje = new Date();
    const fim = new Date(dados.endDate);
    const diasTotais = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
    const diasUteis = contarDiasUteis(hoje, fim);
  
    document.getElementById("diasTotais").textContent = diasTotais;
    document.getElementById("diasUteis").textContent = diasUteis;
  
    // Preencher tabela de itens
    const tbody = document.getElementById("tabela-itens");
  
    for (const item of dados.itens) {
      const tr = document.createElement("tr");
      const tdNome = document.createElement("td");
      const tdQtd = document.createElement("td");
  
      tdNome.textContent = item.nome;
      tdQtd.textContent = calcularQuantidade(item.tipo, hoje, fim, diasUteis);
  
      tr.appendChild(tdNome);
      tr.appendChild(tdQtd);
      tbody.appendChild(tr);
    }
  
    iniciarTemporizador(dados.endDate);
    carregarImagemAleatoria();
    atualizarLinhaDoTempo(hoje, fim);
  }
  
  // Função para tarefas recorrentes
  function calcularQuantidade(tipo, hoje, fim, diasUteis) {
    const meses = mesesRestantes(hoje, fim);
  
    switch (tipo) {
      case "mensal":
        return meses;
      case "bimestral":
        return Math.ceil(meses / 2);
      case "feriado_nacional":
        return contarFeriadosRestantes(hoje, fim, feriadosNacionais);
      case "feriado_municipal":
        return contarFeriadosRestantes(hoje, fim, feriadosSP);
      default:
        return 0;
    }
  }
  
  // Dias úteis
  function contarDiasUteis(start, end) {
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  }
  
  // Quantidade de meses restantes
  function mesesRestantes(inicio, fim) {
    let anos = fim.getFullYear() - inicio.getFullYear();
    let meses = fim.getMonth() - inicio.getMonth();
    let total = anos * 12 + meses;
    if (fim.getDate() >= inicio.getDate()) total++;
    return total;
  }
  
  // Feriados nacionais e municipais
  const feriadosNacionais = [
    "01/01", "21/04", "01/05", "07/09", "12/10", "02/11", "15/11", "25/12"
  ];
  const feriadosSP = ["25/01", "20/11"];
  
  function contarFeriadosRestantes(hoje, fim, lista) {
    const anoInicial = hoje.getFullYear();
    const anoFinal = fim.getFullYear();
    let total = 0;
  
    for (let ano = anoInicial; ano <= anoFinal; ano++) {
      for (const data of lista) {
        const [dia, mes] = data.split('/');
        const feriado = new Date(`${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`);
        if (feriado >= hoje && feriado <= fim) total++;
      }
    }
  
    return total;
  }
  
  // Temporizador em tempo real
  function iniciarTemporizador(dataFinal) {
    const elemento = document.createElement("div");
    elemento.id = "temporizador";
    document.body.appendChild(elemento);
  
    function atualizar() {
      const agora = new Date();
      const distancia = new Date(dataFinal) - agora;
  
      if (distancia <= 0) {
        elemento.textContent = "Parabéns! Você chegou ao fim!";
        clearInterval(intervalo);
        return;
      }
  
      const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
  
      elemento.textContent = `Faltam ${dias} dias, ${horas}h ${minutos}min ${segundos}s até o fim do período.`;
    }
  
    atualizar();
    const intervalo = setInterval(atualizar, 1000);
  }
  
  // Imagem aleatória da galeria
  function carregarImagemAleatoria() {
    const imagens = Array.from({ length: 18 }, (_, i) => `galeria/Marilia (${i + 1}).jpg`);
    const aleatoria = imagens[Math.floor(Math.random() * imagens.length)];
    const img = document.getElementById("foto-motivacional");
    img.src = aleatoria;
    img.alt = "Foto motivacional aleatória";
  }
  
  // Linha do tempo visual com marcador e foto
  function atualizarLinhaDoTempo(inicio, fim) {
    const total = fim.getTime() - inicio.getTime();
    const hoje = new Date().getTime();
    const percorrido = hoje - inicio.getTime();
    const percentual = Math.min(Math.max((percorrido / total) * 100, 0), 100).toFixed(1);
  
    const marcador = document.getElementById("marcador");
    const porcentagemSpan = document.getElementById("porcentagem");
  
    marcador.style.left = `${percentual}%`;
    porcentagemSpan.textContent = `${percentual}%`;
  }
  
  // Iniciar tudo
  carregarDados();
  