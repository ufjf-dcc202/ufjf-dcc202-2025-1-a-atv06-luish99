// Módulo de lógica do jogo Resta Um


export class RestaUm {
    constructor() {
        this.tabuleiro = this.criarTabuleiroInicial();
        this.pecasRestantes = 32;
        this.pecaSelecionada = null;
        this.movimentosValidos = [];
    }

    // Cria o tabuleiro inicial com o formato tradicional do Resta Um
    criarTabuleiroInicial() {
        const tabuleiro = Array(7).fill().map(() => Array(7).fill(null));
        
        // Definir o formato de cruz tradicional
        // 0 = vazio (fora do jogo), 1 = peça, 2 = buraco
        const formato = [
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 2, 1, 1, 1], // Centro vazio
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0]
        ];

        for (let linha = 0; linha < 7; linha++) {
            for (let coluna = 0; coluna < 7; coluna++) {
                tabuleiro[linha][coluna] = formato[linha][coluna];
            }
        }

        return tabuleiro;
    }

    // Verifica se uma posição é válida no tabuleiro, essa função checa se a posição está dentro dos limites do tabuleiro e não está vazia
    posicaoValida(linha, coluna) {
        return linha >= 0 && linha < 7 && coluna >= 0 && coluna < 7 && 
               this.tabuleiro[linha][coluna] !== 0;
    }

    // Verifica se há uma peça na posição
    temPeca(linha, coluna) {
        return this.posicaoValida(linha, coluna) && this.tabuleiro[linha][coluna] === 1;
    }

    // Verifica se a posição está vazia (buraco)
    estaVazia(linha, coluna) {
        return this.posicaoValida(linha, coluna) && this.tabuleiro[linha][coluna] === 2;
    }

    // Seleciona uma peça
    selecionarPeca(linha, coluna) {
        if (!this.temPeca(linha, coluna)) {
            return false;
        }

        this.pecaSelecionada = { linha, coluna };
        this.movimentosValidos = this.calcularMovimentosValidos(linha, coluna);
        return true;
    }

    // Calcula os movimentos válidos para uma peça
    calcularMovimentosValidos(linha, coluna) {
        const movimentos = [];
        const direcoes = [
            [-2, 0], [2, 0], [0, -2], [0, 2] // cima, baixo, esquerda, direita
        ];

        for (const [deltaLinha, deltaColuna] of direcoes) {
            const novaLinha = linha + deltaLinha;
            const novaColuna = coluna + deltaColuna;
            const linhaMeio = linha + deltaLinha / 2;
            const colunaMeio = coluna + deltaColuna / 2;

            // Verifica se o movimento é válido:
            // 1. Destino é válido e vazio
            // 2. Há uma peça no meio do caminho
            if (this.estaVazia(novaLinha, novaColuna) && 
                this.temPeca(linhaMeio, colunaMeio)) {
                movimentos.push({ linha: novaLinha, coluna: novaColuna });
            }
        }

        return movimentos;
    }

    // Verifica se um movimento é válido
    movimentoValido(linha, coluna) {
        for (let i = 0; i < this.movimentosValidos.length; i++) {
            const mov = this.movimentosValidos[i];
            if (mov.linha === linha && mov.coluna === coluna) {
                return true;
            }
        }
        return false;
    }

    // Executa um movimento
    moverPeca(linha, coluna) {
        if (!this.pecaSelecionada || !this.movimentoValido(linha, coluna)) {
            return false;
        }

        const pecaOrigem = this.pecaSelecionada;
        const linhaMeio = (pecaOrigem.linha + linha) / 2;
        const colunaMeio = (pecaOrigem.coluna + coluna) / 2;

        // Executar o movimento
        this.tabuleiro[pecaOrigem.linha][pecaOrigem.coluna] = 2; // Buraco
        this.tabuleiro[linhaMeio][colunaMeio] = 2; // Remove peça do meio
        this.tabuleiro[linha][coluna] = 1; // Nova posição da peça

        this.pecasRestantes--;
        this.limparSelecao();

        return true;
    }

    // Limpa a seleção atual
    limparSelecao() {
        this.pecaSelecionada = null;
        this.movimentosValidos = [];
    }

    // Verifica se o jogo terminou
    jogoTerminado() {
        // Procura por qualquer peça que ainda pode se mover
        for (let linha = 0; linha < 7; linha++) {
            for (let coluna = 0; coluna < 7; coluna++) {
                if (this.temPeca(linha, coluna)) {
                    const movimentos = this.calcularMovimentosValidos(linha, coluna);
                    if (movimentos.length > 0) {
                        return false; // Ainda há movimentos possíveis
                    }
                }
            }
        }
        return true; // Não há mais movimentos possíveis
    }

    // Verifica se o jogador ganhou (apenas 1 peça restante)
    jogadorGanhou() {
        return this.pecasRestantes === 1;
    }

    // Reinicia o jogo
    reiniciar() {
        this.tabuleiro = this.criarTabuleiroInicial();
        this.pecasRestantes = 32;
        this.limparSelecao();
    }

    // Retorna o estado atual do tabuleiro
    obterEstado() {
        return {
            tabuleiro: this.tabuleiro.map(linha => [...linha]),
            pecasRestantes: this.pecasRestantes,
            pecaSelecionada: this.pecaSelecionada,
            movimentosValidos: [...this.movimentosValidos],
            jogoTerminado: this.jogoTerminado(),
            jogadorGanhou: this.jogadorGanhou()
        };
    }
}
