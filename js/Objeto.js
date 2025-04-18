class Objeto {
    constructor() {
        this.x = random(width);
        this.y = height;
        this.diam = 30;
        this.velocidadeX = random(-3, 3);
        this.velocidadeY = random(-10, -20);
        this.gravidade = 0.4;
        this.tipo = this.definirTipo();
        this.img = loadImage(this.definirImagem(this.tipo));
        this.som = createAudio(this.definirSom(this.tipo));
    }

    definirTipo() {
        let r = random();
        if (r < 0.475) { return "mau" };
        if (r < 0.95) { return "bom" };
        return "coracao";
    }

    definirSom(tipo) {

        if (tipo === "bom") {
            return "assets/music/pickupMau.wav";
        };

        if (tipo === "mau") {

            return "assets/music/pickupBom.wav";
        };

        return "assets/music/powerCoracao.wav";

    }

    playSom(){
        this.som.play();
    }

    definirImagem(tipo) {
        if (tipo === "bom") {

            let imagens = [
                "assets/img/frutas/apple1.png",
                "assets/img/frutas/banana1.png",
                "assets/img/frutas/blackberry1.png",
                "assets/img/frutas/cherry1.png",
                "assets/img/frutas/coconut1.png",
                "assets/img/frutas/pineapple1.png",
                "assets/img/frutas/strawberry1.png"
            ];

            let r = Math.floor(Math.random() * 7);

            return imagens[r];
        };

        if (tipo === "mau") {

            let imagens = [
                "assets/img/diabetes/happymealf.png",
                "assets/img/diabetes/burguerK.png",
                "assets/img/diabetes/kfc.png"
            ];

            let r = Math.floor(Math.random() * 3);

            return imagens[r];
        };

        return "assets/img/coracaof.png";
    }

    update() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        this.velocidadeY += this.gravidade;
    }

    mostra() {
        image(this.img, this.x - this.diam, this.y - this.diam, this.diam * 2, this.diam * 2);
    }

    saiuEcra() {
        let saiu;

        if (this.y > height + this.diam) {
            saiu = true;
        } else {
            saiu = false;
        }

        return saiu;
    }

    detetaColisao(px, py) {
        let d = dist(px, py, this.x, this.y);
        return d < this.diam;
    }

}