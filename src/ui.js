// Módulo de interface do jogo 
// Separado da lógica - apenas manipulação do DOM e eventos

export class InterfaceRestaUm {
    constructor(jogo) {
        this.jogo = jogo;
        this.tabuleiro = document.getElementById('tabuleiro');
        this.contadorPecas = document.getElementById('pieces-count');
        this.botaoReiniciar = document.getElementById('reset-button');
        this.celulas = [];
        
        this.inicializar();
    }

    // Inicializa a interface
    inicializar() {
        this.criarEventos();
        this.coletarCelulas();
        this.atualizarInterface();
    }

    // Coleta todas as células do DOM
    coletarCelulas() {
        this.celulas = [];
        const celulasDOM = this.tabuleiro.querySelectorAll('.celula');
        
        celulasDOM.forEach(celula => {
            const linha = parseInt(celula.getAttribute('data-row'));
            const coluna = parseInt(celula.getAttribute('data-col'));
            
            if (!this.celulas[linha]) {
                this.celulas[linha] = [];
            }
            this.celulas[linha][coluna] = celula;
        });
    }

    // Cria os eventos da interface
    criarEventos() {
        // Evento do botão reiniciar
        this.botaoReiniciar.addEventListener('click', () => {
            this.reiniciarJogo();
        });

        // Eventos das células
        this.tabuleiro.addEventListener('click', (evento) => {
            const celula = evento.target.closest('.celula');
            if (!celula) return;

            const linha = parseInt(celula.getAttribute('data-row'));
            const coluna = parseInt(celula.getAttribute('data-col'));

            this.clicarCelula(linha, coluna);
        });
    }

    // Manipula o clique em uma célula
    clicarCelula(linha, coluna) {
        const estado = this.jogo.obterEstado();

        // Se há uma peça selecionada e clicou em um movimento válido
        if (estado.pecaSelecionada && this.jogo.movimentoValido(linha, coluna)) {
            if (this.jogo.moverPeca(linha, coluna)) {
                this.atualizarInterface();
                this.verificarFimDeJogo();
            }
        }
        // Se clicou em uma peça para selecioná-la
        else if (this.jogo.temPeca(linha, coluna)) {
            if (this.jogo.selecionarPeca(linha, coluna)) {
                this.atualizarInterface();
            }
        }
        // Se clicou em uma área inválida, limpa a seleção
        else {
            this.jogo.limparSelecao();
            this.atualizarInterface();
        }
    }

    // Atualiza toda a interface com base no estado do jogo
    atualizarInterface() {
        const estado = this.jogo.obterEstado();
        
        this.atualizarTabuleiro(estado);
        this.atualizarContador(estado.pecasRestantes);
    }

    // Atualiza o tabuleiro visual
    atualizarTabuleiro(estado) {
        for (let linha = 0; linha < 7; linha++) {
            for (let coluna = 0; coluna < 7; coluna++) {
                const celula = this.celulas[linha] && this.celulas[linha][coluna];
                if (!celula) continue;

                // Limpa todas as classes de estado
                celula.classList.remove('peca', 'buraco', 'vazia', 'selecionada', 'movimento-valido');

                // Define o tipo da célula baseado no estado do jogo
                const valorCelula = estado.tabuleiro[linha][coluna];
                
                if (valorCelula === 0) {
                    celula.classList.add('vazia');
                } else if (valorCelula === 1) {
                    celula.classList.add('peca');
                } else if (valorCelula === 2) {
                    celula.classList.add('buraco');
                }

                // Marca a peça selecionada
                if (estado.pecaSelecionada && 
                    estado.pecaSelecionada.linha === linha && 
                    estado.pecaSelecionada.coluna === coluna) {
                    celula.classList.add('selecionada');
                }

                // Marca os movimentos válidos
                const movimentoValido = estado.movimentosValidos.some(mov => 
                    mov.linha === linha && mov.coluna === coluna
                );
                if (movimentoValido) {
                    celula.classList.add('movimento-valido');
                }
            }
        }
    }

    // Atualiza o contador de peças
    atualizarContador(pecasRestantes) {
        this.contadorPecas.textContent = pecasRestantes;
    }

    // Verifica se o jogo terminou e exibe mensagem
    verificarFimDeJogo() {
        const estado = this.jogo.obterEstado();
        
        if (estado.jogoTerminado) {
            setTimeout(() => {
                if (estado.jogadorGanhou) {
                    this.exibirMensagem('🎉 Parabéns! Você ganhou! Restou apenas 1 peça!', 'sucesso');
                } else {
                    this.exibirMensagem('😔 Fim de jogo! Não há mais movimentos possíveis.', 'fim');
                }
            }, 500);
        }
    }

    // Exibe mensagens para o jogador
    exibirMensagem(texto, tipo) {
        alert(texto);
    }

    // Reinicia o jogo
    reiniciarJogo() {
        this.jogo.reiniciar();
        this.atualizarInterface();
        
        // Remove mensagens existentes
        const mensagens = document.querySelectorAll('.mensagem');
        mensagens.forEach(msg => msg.remove());
    }

    
}
