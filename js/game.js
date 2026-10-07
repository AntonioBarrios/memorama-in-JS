const CONFIG = {
    PARES: 6,
    ICONOS: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'],
    DELAY: 1000
};

const Game = {
    mazo: [],
    seleccionadas: [],
    aciertos: 0,
    bloqueado: false,

    init() {
        const duplicados = [...CONFIG.ICONOS, ...CONFIG.ICONOS];
        // Algoritmo de mezcla moderno (Fisher-Yates) en lugar de sort aleatorio
        this.mazo = this.mezclar(duplicados);
        this.aciertos = 0;
        this.seleccionadas = [];
        this.bloqueado = false;
        
        // Asegurarnos de cerrar el modal si reiniciamos
        const modal = document.getElementById("win-modal");
        if (modal && modal.open) modal.close();

        this.render();
    },

    mezclar(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    render() {
        const grid = document.getElementById("memo-grid");
        if (!grid) return;
        grid.innerHTML = ""; 

        this.mazo.forEach((icono, i) => {
            const carta = document.createElement('div');
            carta.className = 'memo-card';
            carta.innerHTML = `
                <div class="memo-card-inner">
                    <div class="memo-card-front"></div>
                    <div class="memo-card-back"><span>${icono}</span></div>
                </div>`;
            
            // Event listener limpio en lugar de onclick inline
            carta.addEventListener('click', () => this.voltear(carta, i));
            grid.appendChild(carta);
        });

        // Configurar el botón de reinicio del modal una sola vez
        const restartBtn = document.getElementById("restart-btn");
        if (restartBtn && !restartBtn.dataset.listener) {
            restartBtn.dataset.listener = "true";
            restartBtn.addEventListener('click', () => this.init());
        }
    },

    voltear(carta, i) {
        if (this.bloqueado || carta.classList.contains('flipped')) return;

        carta.classList.add('flipped');
        this.seleccionadas.push({ carta, i });

        if (this.seleccionadas.length === 2) {
            this.bloqueado = true;
            this.checarPareja();
        }
    },

    checarPareja() {
        const [c1, c2] = this.seleccionadas;
        const match = this.mazo[c1.i] === this.mazo[c2.i];

        if (match) {
            this.aciertos++;
            this.seleccionadas = [];
            this.bloqueado = false;
            
            if (this.aciertos === CONFIG.PARES) {
                setTimeout(() => {
                    const modal = document.getElementById("win-modal");
                    if (modal) modal.showModal(); // <--- Adiós alert, hola modal nativo
                }, 500);
            }
        } else {
            setTimeout(() => {
                c1.carta.classList.remove('flipped');
                c2.carta.classList.remove('flipped');
                this.seleccionadas = [];
                this.bloqueado = false;
            }, CONFIG.DELAY);
        }
    }
};

Game.init();