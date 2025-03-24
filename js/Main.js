let video;
let handPose;
let hands = [];
let objetos = [];
let score = 0;
let vidas = 3;
let volumeMusica = 0.1;
let sliderMusica;
let rastros = [];
let splashes = [];
let bg;
let pause = false;

/***
 *
 * 0 = menu inicial
 * 1 = jogo
 * 2 = menu opcoes
 * 3 = informações
 *
 * **/
let estadoJogo = 0;
let speechRec;
let gameover = false;

function preload() {
  handPose = ml5.handPose({ flipped: true });
  carregaMedia();
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  handPose.detectStart(video, gotHands);

  let lang = navigation.language || "pt-BR";
  speechRec = new p5.SpeechRec(lang, gotSpeech);
  let continuous = true;
  let interim = false;
  speechRec.start(continuous, interim);

  slider();

  textFont(fonteTexto);

  initMusica();
}

function slider() {
  sliderMusica = createSlider(0, 1, volumeMusica, 0.01);
  sliderMusica.position(20, 50);
  sliderMusica.size(200);
  sliderMusica.addClass('inputSlider');
  sliderMusica.hide();
}

function draw() {
  initMusica();

  switch (estadoJogo) {
    case 0:
      sliderMusica.hide();
      menuInicial();
      break;

    case 1:
      sliderMusica.hide();
      jogo();
      break;

    case 2:
      sliderMusica.show();
      menuOpcoes();
      break;
    case 3:
      sliderMusica.hide();
      menuInfo();
      break;
  }

  volumeMusica = sliderMusica.value();
  musica.volume(volumeMusica);

  //console.log(volumeMusica);
}

function menuInicial() {

  background(bg);
  fill("white");
  rect(width / 2 - 200, 20, 400, 80);
  textSize(32);
  fill(0);
  text("Corta-Diabetes", width / 2 - 190, height / 7);

  fill("green");
  rect(width / 2 - 85, height / 2 - 65, 180, 40);
  textSize(20);
  fill(0);
  text("Iniciar", width / 2 - 55, height / 2 - 40);

  fill("red");
  rect(width / 2 - 85, height / 2 + 5, 180, 40);
  textSize(20);
  fill(0);
  text("Opções", width / 2 - 45, height / 2 + 30);

  fill("lightblue");
  rect(width / 2 - 85, height / 2 + 75, 180, 40);
  textSize(20);
  fill(0);
  text("Como jogar", width / 2 - 80, height / 2 + 100);

  fill("white");
  rect(width / 4, height - 50, 470, 30);
  textSize(15);
  fill("black");
  text("Paulo Novo && Hugo Diniz | ECGM - TI ", width / 2 - 150, height - 30);
}

function menuOpcoes() {
  background(bg);
  fill("white");
  rect(width / 2 - 105, height / 5 - 10, 200, 50);
  textSize(32);
  fill("black");
  text("Opções", width / 2 - 80, height / 2 - 120);

  fill("lightblue");
  rect(width / 3 - 20, height / 2 - 50, 260, 70);
  textSize(18);
  fill("black");
  text("Volume da Música:", width / 2 - 120, height / 2 - 30);

  sliderMusica.position(width / 2 - 95, height / 2);
  sliderMusica.size(200);

  fill("red");
  rect(width / 2 - 55, height / 2 + 75, 120, 40);
  textSize(20);
  fill(255);
  text("Voltar", width / 2 - 45, height / 2 + 100);
}

function menuInfo() {
  background(bg);
  fill("lightblue");
  rect(width / 4, height / 5 - 60, 300, 45);
  textSize(32);
  fill("black");
  text("Informações", width / 4, height / 2 - 170);

  fill("white");
  rect(width / 7 - 10, height / 3 - 60, 470, 310);
  textSize(14);
  fill("black");
  text("Bem-vindo ao Corta-Diabetes.", width / 4 - 20, height / 2 - 120);
  text("Este é um jogo interativo sendo o ", width / 4 - 70, height / 2 - 80);
  text(
    "principal objetivo do jogo cortar os ",
    width / 4 - 70,
    height / 2 - 60
  );
  text("alimentos prejudiciais à saúde.", width / 4 - 70, height / 2 - 40);
  text("Para cortar os objetos prejudiciais", width / 4 - 70, height / 2);
  text("basta juntar o polegar ao indicador.", width / 4 - 70, height / 2 + 20);
  text(
    "Cuidado com os alimentos bons e tenta",
    width / 4 - 70,
    height / 2 + 40
  );
  text("apanhar as vidas que vão aparecendo.", width / 4 - 70, height / 2 + 60);
  text("Por cada fruta que cortes", width / 4 - 70, height / 2 + 100);
  text("perdes uma vida.", width / 4 - 70, height / 2 + 120);
  text("Boa sorte!", width / 2 - 70, height / 2 + 160);

  fill("red");
  rect(width / 2 - 65, height - 55, 120, 40);
  textSize(20);
  fill(255);
  text("Voltar", width / 2 - 55, height - 30);
}

function gameOverScreen() {

  fill('white');
  rect(width / 4 - 30, height / 3, 400, 50);
  textSize(15);
  fill('black');
  text("Gameover!! Tiveste " + score + " pontos!!", width / 2 - 165, height / 2 - 50);

  fill("green");
  rect(width / 2 - 85, height / 2 + 5, 180, 40);
  textSize(20);
  fill(0);
  text("Reiniciar", width / 2 - 65, height / 2 + 30);

  fill("red");
  rect(width / 2 - 85, height / 2 + 75, 180, 40);
  textSize(20);
  fill(0);
  text("Voltar", width / 2 - 40, height / 2 + 100);

}

function gotSpeech() {
  if (speechRec.resultValue) {
    console.log(speechRec.resultString);

    if (speechRec.resultString == "voltar" && estadoJogo != 1) estadoJogo = 0;

    if (estadoJogo == 0) {
      if (speechRec.resultString == "jogar" || speechRec.resultString == "iniciar") {
        estadoJogo = 1;

        initJogo();
      } else if (speechRec.resultString == "opções") {
        estadoJogo = 2;
      } else if (
        speechRec.resultString == "ajuda" ||
        speechRec.resultString == "info" ||
        speechRec.resultString == "informações"
      ) {
        estadoJogo = 3;
      }
    }

   // console.log(gameover);

    if (gameover) {
      if (speechRec.resultString == "reiniciar") {

        restart();

      } else if (
        speechRec.resultString == "voltar" ||
        speechRec.resultString == "menu"
      ) {
        estadoJogo = 0;
        gameover = false;
        //console.log("voltei");
      }
    }
  }
}

function initJogo() {
  score = 0;
  vidas = 3;

  objetos = [];
  for (let i = 0; i < 5; i++) {
    objetos.push(new Objeto());
  }
}

function jogo() {
  //console.log(gameover);
  if (!gameover) {
    image(video, 0, 0);

    fill(0);
    rect(0, 0, 190, 75);
    textSize(24);
    fill(255);
    text("Score: " + score, 10, 30);
    text("Vidas: " + vidas, 10, 60);

    if (!pause) {


      for (let i = rastros.length - 1; i >= 0; i--) {
        let rastro = rastros[i];
        fill(255, 0, 0, rastro.alpha);
        noStroke();
        //console.log(rastro);

        circle(rastro.x, rastro.y, 10);

        rastro.alpha -= 10;

        if (rastro.alpha <= 0) {
          rastros.splice(i, 1);
        }
      }

      for (let i = splashes.length - 1; i >= 0; i--) {
        let splash = splashes[i];

        switch (splash.tipo) {
          case "bom":
            fill(255, 0, 0, splash.alpha);
            break;
          case "mau":
            fill(0, 255, 0, splash.alpha);
            break;
          case "coracao":
            fill(0, 0, 255, splash.alpha);
            break;
        }

        noStroke();
        //console.log(rastro);

        circle(splash.x, splash.y, 50);

        splash.alpha -= 10;

        if (splash.alpha <= 0) {
          splashes.splice(i, 1);
        }
      }

      for (let i = objetos.length - 1; i >= 0; i--) {
        objetos[i].update();
        objetos[i].mostra();

        if (objetos[i].saiuEcra()) {
          objetos.splice(i, 1);
          objetos.push(new Objeto());
        }
      }

      if (hands.length > 0) {
        for (let hand of hands) {
          if (hand.handedness === "Right") {
            let index = hand.index_finger_tip;
            let thumb = hand.thumb_tip;
            let distance = dist(index.x, index.y, thumb.x, thumb.y);

            if (distance < 30) {
              let x = (index.x + thumb.x) * 0.5;
              let y = (index.y + thumb.y) * 0.5;

              rastros.push({ x, y, alpha: 255 });

              for (let i = objetos.length - 1; i >= 0; i--) {
                if (objetos[i].detetaColisao(x, y)) {
                  if (objetos[i].tipo === "mau") {
                    score++;
                    splashes.push({ x: objetos[i].x, y: objetos[i].y, tipo: "mau", alpha: 255 });
                  } else if (objetos[i].tipo === "coracao") {
                    vidas++;
                    splashes.push({ x: objetos[i].x, y: objetos[i].y, tipo: "coracao", alpha: 255 });

                  } else if (objetos[i].tipo === "bom") {
                    vidas--;
                    splashes.push({ x: objetos[i].x, y: objetos[i].y, tipo: "bom", alpha: 255 });
                  }
                  objetos[i].playSom();
                  objetos.splice(i, 1);
                  objetos.push(new Objeto());
                }
              }
            }
          }
        }
      }



    } else {
      fill(255, 0, 0);
      text("JOGO EM PAUSA", width / 2 - 150, height / 2);
    }

    if (vidas <= 0) {
      gameover = true;
    }

  } else {
    gameOverScreen();
  }
}

function initMusica() {
  musica.volume(volumeMusica);
  musica.loop();
}

function carregaMedia() {
  bg = loadImage("assets/img/background.png");
  fonteTexto = loadFont("assets/font/joystix_monospace.otf");
  musica = createAudio("assets/music/undauntable.mp3");

  console.log("carregado");
}

function restart() {
  gameover = false;
  estadoJogo = 1;

  initJogo();
  console.log("reiniciei");
}

function keyPressed() {
  if (estadoJogo == 1) {
    if (keyCode == ESCAPE) {
      pause = !pause;
    }
  }

}

function mousePressed() {
  switch (estadoJogo) {
    case 0:
      // Botão iniciar
      if (mouseX > width / 2 - 85 && mouseX < width / 2 + 95 && mouseY > height / 2 - 65 && mouseY < height / 2 - 25) {
        estadoJogo = 1;
        initJogo();
      }
      // Botão das opções
      else if (mouseX > width / 2 - 85 && mouseX < width / 2 + 95 && mouseY > height / 2 + 5 && mouseY < height / 2 + 45) {
        estadoJogo = 2;
      }
      // Botão como jogar
      else if (mouseX > width / 2 - 85 && mouseX < width / 2 + 95 && mouseY > height / 2 + 75 && mouseY < height / 2 + 115) {
        estadoJogo = 3;
      }
      break;

    case 1:
      if (gameover) {
        // Botão reiniciar
        if (mouseX > width / 2 - 85 && mouseX < width / 2 + 95 && mouseY > height / 2 + 5 && mouseY < height / 2 + 45) {
          restart();
        }
        // Botão voltar
        else if (mouseX > width / 2 - 85 && mouseX < width / 2 + 95 && mouseY > height / 2 + 75 && mouseY < height / 2 + 115) {

          estadoJogo = 0;
          gameover = false;

        }
      }
      break;

    case 2:
      // Botão voltar opções
      if (mouseX > width / 2 - 85 && mouseX < width / 2 + 95 && mouseY > height / 2 + 75 && mouseY < height / 2 + 115) {
        estadoJogo = 0;
      }
      break;

    case 3:
      // Botão voltar info
      if (mouseX > width / 2 - 65 && mouseX < width / 2 + 55 && mouseY > height - 55 && mouseY < height - 15) {
        estadoJogo = 0;
      }
      break;
  }
}

function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}
