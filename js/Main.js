let video;
let handPose;
let hands = [];
let objetos = [];
let score = 0;
let vidas = 3;
let volumeMusica = 0.5;
let sliderMusica;
let rastros = [];
//let btnIniciar;
//let btnOpcoes;
//let btnAjuda;
//let btnVoltar;

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
    createCanvas(640,480);
    video = createCapture(VIDEO, { flipped: true });
    video.hide();
    
    handPose.detectStart(video, gotHands);

    let lang = navigation.language || 'pt-BR';
    speechRec = new p5.SpeechRec(lang, gotSpeech);
    let continuous = true;
    let interim = false;
    speechRec.start(continuous, interim);

    slider();

    textFont(fonteTexto);

    initMusica();

}

function slider(){

    sliderMusica = createSlider(0, 1, volumeMusica, 0.01);
    sliderMusica.position(20, 50);
    sliderMusica.size(200);
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
    background(163, 186, 255);
    textSize(32);
    text("Corta-Diabetes", width / 2 - 200, height / 3);
    textSize(15);
    text("Paulo Novo && Hugo Diniz | ECGM - TI ", width / 2 - 150, height - 30);

}

function menuOpcoes() {

    background(50, 120, 180);
    fill(255);
    textSize(32);
    text("Menu Opções", width / 2 - 100, height / 2 - 100);
    textSize(18);
    text("Volume da Música:", 20, 50);

    sliderMusica.position(20, 60);
    sliderMusica.size(200);
}


function menuInfo() {

    background(67, 120, 30);
    textSize(32);
    text("Ajuda info", width / 2 - 100, height / 2);


}

function gotSpeech() {

    if (speechRec.resultValue) {

        console.log(speechRec.resultString);

        if (speechRec.resultString == "voltar" && estadoJogo != 1) estadoJogo = 0;

        if (estadoJogo == 0) {

            if (speechRec.resultString == "jogar") {
                estadoJogo = 1;

                initJogo();

            } else if (speechRec.resultString == "opções") {
                estadoJogo = 2;
            } else if (speechRec.resultString == "ajuda" || speechRec.resultString == "info" || speechRec.resultString == "informações") {
                estadoJogo = 3;
            }

        }

        console.log(gameover);

        if (gameover) {

            if (speechRec.resultString == "reiniciar") {

                gameover = false;
                estadoJogo = 1;

                score = 0;
                vidas = 3;

                initJogo();
                console.log("reiniciei");

            } else if (speechRec.resultString == "voltar" || speechRec.resultString == "menu") {

                estadoJogo = 0;
                gameover = false;
                console.log("voltei");

            }
        }
    }
}

function initJogo(){
    objetos = [];
    for (let i = 0; i < 5; i++) {
        objetos.push(new Objeto());
    }
}

function jogo() {

    if (!gameover) {
        image(video, 0, 0);

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
                                } else if (objetos[i].tipo === "coracao") {
                                    vidas++;
                                } else if (objetos[i].tipo === "bom") {
                                    vidas--;
                                }
                                objetos.splice(i, 1);
                                objetos.push(new Objeto());
                            }
                        }
                    }
                }
            }
        }

        fill(255);
        textSize(24);
        text("Score: " + score, 10, 30);
        text("Vidas: " + vidas, 10, 60);

        if (vidas <= 0) {
            gameover = true;
        }

    } else {
        textSize(15);
        text("Gameover!! Tiveste " + score + " pontos!!", width / 3, height / 2);
    }
}

function initMusica() {

    musica.volume(volumeMusica);
    musica.loop();

}

function carregaMedia() {

    fonteTexto = loadFont("assets/font/joystix_monospace.otf");
    musica = createAudio("assets/music/undauntable.mp3");

    console.log("carregado");

}

function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}