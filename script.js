document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const scoreXDisplay = document.getElementById('scoreX');
    const scoreODisplay = document.getElementById('scoreO');

    // Variáveis do jogo
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = { X: 0, O: 0 };

    // Mensagens de status
    const winningMessage = () => `Jogador ${currentPlayer} venceu! 🎉`;
    const drawMessage = () => `Jogo empatou! 🤝`;
    const currentPlayerTurn = () => `Vez do jogador ${currentPlayer}`;

    // Combinações de vitória
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
        [0, 4, 8], [2, 4, 6]             // diagonais
    ];

    // Inicializa o jogo
    statusDisplay.textContent = currentPlayerTurn();
    
    // Adiciona efeito de entrada nas células
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.8)';
            setTimeout(() => {
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            }, 50);
        }, index * 50);
    });

    // Função para lidar com o clique nas células
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        // Verifica se a célula já foi clicada ou se o jogo acabou
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            // Adiciona efeito de shake se a célula já foi clicada
            if (gameState[clickedCellIndex] !== '') {
                clickedCell.classList.add('shake');
                setTimeout(() => {
                    clickedCell.classList.remove('shake');
                }, 500);
            }
            return;
        }

        // Atualiza o estado do jogo e a UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Adiciona efeito de som (simulado com vibração visual)
        playMoveSound(clickedCell);

        // Verifica se o jogo terminou
        checkResult();
    }
    
    // Função para simular efeito de som com vibração visual
    function playMoveSound(cell) {
        cell.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 150);
    }

    // Função para verificar o resultado do jogo
    function checkResult() {
        let roundWon = false;
        let winningLine = null;

        // Verifica todas as combinações de vitória
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const position1 = gameState[a];
            const position2 = gameState[b];
            const position3 = gameState[c];

            if (position1 === '' || position2 === '' || position3 === '') {
                continue;
            }

            if (position1 === position2 && position2 === position3) {
                roundWon = true;
                winningLine = [a, b, c];
                break;
            }
        }

        // Se alguém ganhou
        if (roundWon) {
            statusDisplay.textContent = winningMessage();
            statusDisplay.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
            gameActive = false;
            
            // Destaca a linha vencedora
            highlightWinningCells(winningLine);
            
            // Atualiza o placar com animação
            updateScore(currentPlayer);
            
            // Adiciona confete para celebrar a vitória
            celebrateWin();
            
            return;
        }

        // Se deu empate
        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = drawMessage();
            statusDisplay.style.color = 'var(--secondary-color)';
            gameActive = false;
            
            // Efeito visual para empate
            cells.forEach(cell => {
                cell.classList.add('draw');
                setTimeout(() => {
                    cell.classList.remove('draw');
                }, 1000);
            });
            
            return;
        }

        // Se o jogo continua, troca o jogador
        changePlayer();
    }
    
    // Função para destacar as células vencedoras
    function highlightWinningCells(winningLine) {
        winningLine.forEach(index => {
            const cell = cells[index];
            cell.classList.add('winner');
            
            // Adiciona efeito de pulsação nas células vencedoras
            cell.style.transform = 'scale(1.05)';
            cell.style.boxShadow = '0 0 15px rgba(108, 92, 231, 0.5)';
        });
    }
    
    // Função para celebrar a vitória
    function celebrateWin() {
        // Adiciona classe para animar o status
        statusDisplay.classList.add('celebrate');
        setTimeout(() => {
            statusDisplay.classList.remove('celebrate');
        }, 1000);
    }

    // Função para trocar o jogador atual
    function changePlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = currentPlayerTurn();
        statusDisplay.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
    }

    // Função para atualizar o placar
    function updateScore(player) {
        scores[player]++;
        
        if (player === 'X') {
            // Animação para o placar X
            scoreXDisplay.classList.add('score-update');
            setTimeout(() => {
                scoreXDisplay.textContent = scores.X;
                scoreXDisplay.classList.remove('score-update');
            }, 300);
        } else {
            // Animação para o placar O
            scoreODisplay.classList.add('score-update');
            setTimeout(() => {
                scoreODisplay.textContent = scores.O;
                scoreODisplay.classList.remove('score-update');
            }, 300);
        }
    }

    // Função para reiniciar o jogo
    function restartGame() {
        // Efeito de clique no botão
        restartButton.classList.add('clicked');
        setTimeout(() => {
            restartButton.classList.remove('clicked');
        }, 200);
        
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = currentPlayerTurn();
        statusDisplay.style.color = 'var(--x-color)';
        
        // Limpa as células com efeito de fade
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.opacity = '0.5';
                cell.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'winner', 'draw');
                    cell.style.boxShadow = '';
                    cell.style.opacity = '1';
                    cell.style.transform = 'scale(1)';
                }, 150);
            }, index * 30);
        });
    }

    // Adiciona os event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        
        // Adiciona efeito de hover com som
        cell.addEventListener('mouseenter', () => {
            if (cell.textContent === '' && gameActive) {
                cell.style.backgroundColor = currentPlayer === 'X' ? 
                    'rgba(232, 67, 147, 0.1)' : 'rgba(0, 184, 148, 0.1)';
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            cell.style.backgroundColor = '';
        });
    });
    
    restartButton.addEventListener('click', restartGame);
    
    // Adiciona efeito de hover no botão de reiniciar
    restartButton.addEventListener('mouseenter', () => {
        restartButton.style.transform = 'translateY(-3px)';
    });
    
    restartButton.addEventListener('mouseleave', () => {
        restartButton.style.transform = '';
    });
});