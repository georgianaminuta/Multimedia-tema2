const words = ["table", "chair", "piano", "mouse", "house", "plant", "brain", "cloud", "beach", "fruit"];

let stats = {
    played: 0,
    won: 0,
    currentStreak: 0
};

function loadStats() {
    let saved = localStorage.getItem('wordleStats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

function saveStats() {
    localStorage.setItem('wordleStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
    document.getElementById('gamesPlayed').textContent = stats.played;
    let winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
    document.getElementById('winPercent').textContent = winPct + '%';
    document.getElementById('currentStreak').textContent = stats.currentStreak;
}


window.onload = function () {
    let board = document.getElementById('board');
    let guessButton = this.document.getElementById('guessButton');
    let guessInput = this.document.getElementById('guessInput');
    let newGameButton = this.document.getElementById('newGameButton');
    let errorMsg = this.document.getElementById('errorMsg');

    loadStats();
    updateStatsDisplay();

    for (let i = 0; i < 6; i++) {
        let row = this.document.createElement('div');
        row.classList.add('row');
        board.append(row);

        for (let j = 0; j < 5; j++) {
            let cell = this.document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-column', j);
            row.append(cell);
        }
    }

    let word = words[Math.floor(Math.random() * words.length)];
    let tries = 0;
    let gameOver = false;

    guessInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            guessButton.click();
        }
    });

    guessButton.addEventListener('click', function () {
        if (gameOver == true) {
            alert("Game is already over");
            return;
        }

        let guess = guessInput.value.toLowerCase();

        if (guess.length !== 5) {
            errorMsg.textContent = "Please enter exactly 5 letters!";
            return;
        }
        errorMsg.textContent = "";

        let wordLetters = word.split('');
        let guessLetters = guess.split('');
        let used = new Array(5).fill(false);
        let colors = new Array(5).fill('');

        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === wordLetters[i]) {
                colors[i] = 'green';
                used[i] = true;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (colors[i] === 'green') continue;

            let found = false;
            for (let j = 0; j < 5; j++) {
                if (!used[j] && guessLetters[i] === wordLetters[j]) {
                    colors[i] = 'yellow';
                    used[j] = true;
                    found = true;
                    break;
                }
            }
            if (!found) {
                colors[i] = 'red';
            }
        }

        for (let i = 0; i < 5; i++) {
            let currentCell = document.querySelector(
                `[data-row="${tries}"][data-column="${i}"]`
            );
            let currentLetter = document.createTextNode(guess[i]);
            currentCell.append(currentLetter);

            setTimeout(() => {
                currentCell.classList.add(colors[i]);
            }, i * 150);
        }

        if (word == guess) {
            setTimeout(() => {
                alert("You won");
                stats.played++;
                stats.won++;
                stats.currentStreak++;
                saveStats();
                updateStatsDisplay();
                newGameButton.style.display = 'block';
                guessInput.disabled = true;
                guessButton.disabled = true;
            }, 750);
            gameOver = true;
            return;
        };
        if (tries == 5) {
            setTimeout(() => {
                alert("You lost! The word was: " + word.toUpperCase());
                stats.played++;
                stats.currentStreak = 0;
                saveStats();
                updateStatsDisplay();
                newGameButton.style.display = 'block';
                guessInput.disabled = true;
                guessButton.disabled = true;
            }, 750);
            gameOver = true;
            return;
        }

        tries++;
        guessInput.value = "";
    });

    newGameButton.addEventListener('click', function () {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('green', 'yellow', 'red');
        });

        word = words[Math.floor(Math.random() * words.length)];
        tries = 0;
        gameOver = false;
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        newGameButton.style.display = 'none';
        errorMsg.textContent = '';
    });
}
