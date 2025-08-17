// Arquivo principal - integração dos módulos


import { RestaUm } from './restaUm.js';
import { InterfaceRestaUm } from './ui.js';

// Inicialização do jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância do jogo (lógica)
    const jogo = new RestaUm();
    
    // Criar instância da interface
    const interfaceJogo = new InterfaceRestaUm(jogo);
    
    
    
});
