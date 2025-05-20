let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
}

// Array para armazenar as posições das estrelas
let estrelas = [];
function criarEstrelas() {
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height / 2);
    estrelas.push({ x, y });
  }
}

function draw() {
  // Céu noturno
  background(30, 30, 70);

  // Desenha as estrelas (paradas)
  fill(255);
  for (let estrela of estrelas) {
    ellipse(estrela.x, estrela.y, 2, 2);
  }

  // Desenha a lua (maior e à direita)
  fill(255);
  ellipse(width - 50, 50, 50, 50); // Movida para a direita e ligeiramente maior

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
    this.arvores = [];
    this.predios = [];
    this.casas = [];
    this.inicializarElementos();
  }

  inicializarElementos() {
    if (this.tipo === "vegetacao") {
      this.criarVegetacao();
    } else if (this.tipo === "urbanizado") {
      this.criarUrbanizacaoNoturna();
    }
  }

  criarVegetacao() {
    this.arvores = [];
    let numArvores = 8; // Menos árvores
    for (let i = 0; i < numArvores; i++) {
      let x = random(width);
      let yBase = this.altura;
      let treeHeight = random(30, 60); // Árvores maiores
      let treeSize = random(25, 40); // Tamanho da copa
      this.arvores.push({ x: x, yBase: yBase, h: treeHeight, size: treeSize });
    }
  }

  criarUrbanizacaoNoturna() {
    this.predios = [];
    let numPredios = 7;
    for (let i = 0; i < numPredios; i++) {
      let x = random(width - 60) + 30;
      let w = random(30, 80);
      let h = random(80, 150);
      let y = this.altura - h;
      this.predios.push({ x, y, w, h });
    }
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") {
      fill(60, 150, 60);
    } else if (this.tipo === "exposto") {
      fill(139, 69, 19);
    } else if (this.tipo === "urbanizado") {
      fill(120);
    }

    rect(0, this.altura, width, height - this.altura);

    if (this.tipo === "vegetacao") {
      this.desenharVegetacao();
    } else if (this.tipo === "urbanizado") {
      this.desenharUrbanizacaoNoturna();
    }

    fill(255);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }

  desenharVegetacao() {
    for (let arvore of this.arvores) {
      // Tronco
      fill(101, 67, 33); // Marrom
      rect(arvore.x - 5, arvore.yBase - arvore.h, 10, arvore.h);
      // Folhas (bola)
      fill(34, 139, 34); // Verde
      ellipse(arvore.x, arvore.yBase - arvore.h - arvore.size / 2, arvore.size, arvore.size);
    }
  }

  desenharUrbanizacaoNoturna() {
    fill(120); // Cinza para prédios
    for (let predio of this.predios) {
      rect(predio.x, predio.y, predio.w, predio.h);
      // Janelas agora são cinzas também
      fill(80);
      let janelaSize = 5;
      let espacamentoX = predio.w / 8;
      let espacamentoY = predio.h / 12;
      for (let i = 1; i < floor(predio.h / espacamentoY); i += 2) {
        for (let j = 1; j < floor(predio.w / espacamentoX); j += 2) {
          rect(predio.x + j * espacamentoX - janelaSize / 2,
               predio.y + i * espacamentoY - janelaSize / 2,
               janelaSize, janelaSize);
        }
      }
    }
  }
}

function preload() {
  criarEstrelas(); // Cria as estrelas uma vez no início
}
