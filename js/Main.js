let video;
let handPose;
let hands = [];
let objetos = [];
let score = 0;
let vidas = 3;
let rastros = [];

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
}

function gotHands(results) {
    hands = results;
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO, { flipped: true });
    video.hide();
    handPose.detectStart(video, gotHands);

    let lang = navigation.language || 'pt-BR';
    speechRec = new p5.SpeechRec(lang, gotSpeech);
    let continuous = true;
    let interim = false;
    speechRec.start(continuous, interim);
}


function draw() {

    switch (estadoJogo) {
        case 0:
            menuInicial();
            break;

        case 1:
            jogo();
            break;

        case 2:
            menuOpcoes();
            break;
        case 3:
            menuInfo();
        break;
    }

}

function menuInicial() {

    background(125);
    textSize(32);
    text("Menu", width / 2 - 100, height / 2);

}

function menuOpcoes() {

    background(125, 34, 0);
    textSize(32);
    text("Opcoes", width / 2 - 100, height / 2);


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


                objetos = [];
                for (let i = 0; i < 5; i++) {
                    objetos.push(new Objeto());
                }

            } else if (speechRec.resultString == "opções") {
                estadoJogo = 2;
            }else if(speechRec.resultString == "ajuda"){
                estadoJogo = 3;
            }

        }

        console.log(gameover);

        if (gameover) {

            if (speechRec.resultString == "reiniciar") {

                gameover = false;
                estadoJogo = 1;

                objetos = [];
                for (let i = 0; i < 5; i++) {
                    objetos.push(new Objeto());
                }
                console.log("reiniciei");

            } else if (speechRec.resultString == "voltar") {

                estadoJogo = 0;
                gameover = false;
                console.log("voltei");

            }


        }


    }
}

function jogo() {

    if (!gameover) {
        image(video, 0, 0);

        for (let i = rastros.length - 1; i >= 0; i--) {
            let rastro = rastros[i];
            fill(255, 0, 0, rastro.alpha);
            noStroke();
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
            textSize(25);
            score = 0;
            vidas = 3;
        }

    } else {
        textSize(15);
        text("Gameover!! Tiveste " + score + " pontos!!", width / 2, height / 2);
    }
}
