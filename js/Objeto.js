class Objeto {
    constructor() {
        this.x = random(width);
        this.y = height;
        this.diam = 30;
        this.velocidade = random(3, 6);
        this.velocidadeInicial = this.velocidade;
        this.subindo = true;
        this.tipo = this.definirTipo();
        this.img = loadImage(this.definirImagem());
    }

    definirTipo() {
        let r = random();
        if (r < 0.475) { return "mau" };
        if (r < 0.95) { return "bom" };
        return "coracao";
    }

    definirImagem() {
        if (this.tipo === "mau") return "assets/img/happymeal.png";
        if (this.tipo === "bom") return "assets/img/laranja.jpg";
        return "assets/img/coracao.png";
    }

    update() {
        if (this.subindo) {
            this.y -= this.velocidade;
            if (this.y <= height / 3) {
                this.subindo = false;
            }
        } else {
            this.y += this.velocidade * 1.5;
        }
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