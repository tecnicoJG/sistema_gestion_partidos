// Match State
const matchState = {
    courtNumber: 1,
    matchType: "Mejor de 3 Sets",
    matchStart: new Date(),
    matchDuration: 0,
    timerInterval: null,

    team1: {
        player1: "JUGADOR 1",
        player2: "JUGADOR 2",
        sets: 0,
        games: 0,
        points: 0,
        isServing: true
    },

    team2: {
        player1: "JUGADOR 3",
        player2: "JUGADOR 4",
        sets: 0,
        games: 0,
        points: 0,
        isServing: false
    },

    setHistory: [],
    status: "EN JUEGO"
};

// Initialize the display
function initializeDisplay() {
    updateDisplay();
    startTimer();
    setupDemoMode();
}

// Update all display elements
function updateDisplay() {
    // Update court number
    document.getElementById('courtNumber').textContent = matchState.courtNumber;

    // Update player names
    document.getElementById('player1').textContent = matchState.team1.player1;
    document.getElementById('player2').textContent = matchState.team1.player2;
    document.getElementById('player3').textContent = matchState.team2.player1;
    document.getElementById('player4').textContent = matchState.team2.player2;

    // Update scores
    document.getElementById('setsTeam1').textContent = matchState.team1.sets;
    document.getElementById('gamesTeam1').textContent = matchState.team1.games;
    document.getElementById('pointsTeam1').textContent = formatPoints(matchState.team1.points);

    document.getElementById('setsTeam2').textContent = matchState.team2.sets;
    document.getElementById('gamesTeam2').textContent = matchState.team2.games;
    document.getElementById('pointsTeam2').textContent = formatPoints(matchState.team2.points);

    // Update server indicators
    const serverTeam1 = document.getElementById('serverTeam1');
    const serverTeam2 = document.getElementById('serverTeam2');

    if (matchState.team1.isServing) {
        serverTeam1.classList.add('active');
        serverTeam2.classList.remove('active');
        document.getElementById('team1').classList.add('active');
        document.getElementById('team2').classList.remove('active');
    } else {
        serverTeam1.classList.remove('active');
        serverTeam2.classList.add('active');
        document.getElementById('team1').classList.remove('active');
        document.getElementById('team2').classList.add('active');
    }

    // Update set history
    updateSetHistory();

    // Update match info
    document.getElementById('matchType').textContent = matchState.matchType;
    document.getElementById('matchStart').textContent = formatTime(matchState.matchStart);
    document.getElementById('matchStatus').textContent = matchState.status;

    if (matchState.status === "FINALIZADO") {
        document.getElementById('matchStatus').classList.add('finished');
    }
}

// Format points (0, 15, 30, 40, ADV)
function formatPoints(points) {
    const pointsMap = {
        0: "0",
        1: "15",
        2: "30",
        3: "40"
    };

    if (points <= 3) {
        return pointsMap[points];
    }

    // Handle deuce and advantage
    const diff = matchState.team1.points - matchState.team2.points;
    if (Math.abs(diff) < 2) {
        return "40";
    } else if (diff > 0 && matchState.team1.points > 3) {
        return "ADV";
    } else if (diff < 0 && matchState.team2.points > 3) {
        return "ADV";
    }

    return "40";
}

// Update set history display
function updateSetHistory() {
    const historyContent = document.getElementById('setHistoryContent');
    historyContent.innerHTML = '';

    if (matchState.setHistory.length === 0) {
        historyContent.innerHTML = '<div style="color: #b0c4de; text-align: center; width: 100%;">No hay sets finalizados</div>';
        return;
    }

    matchState.setHistory.forEach((set, index) => {
        const setItem = document.createElement('div');
        setItem.className = 'set-item';

        const setNumber = document.createElement('div');
        setNumber.className = 'set-number';
        setNumber.textContent = `SET ${index + 1}`;

        const setScore = document.createElement('div');
        setScore.className = 'set-score';
        setScore.textContent = `${set.team1} - ${set.team2}`;

        if (set.team1 > set.team2) {
            setScore.classList.add('set-winner');
        }

        setItem.appendChild(setNumber);
        setItem.appendChild(setScore);
        historyContent.appendChild(setItem);
    });
}

// Start match timer
function startTimer() {
    if (matchState.timerInterval) {
        clearInterval(matchState.timerInterval);
    }

    matchState.timerInterval = setInterval(() => {
        if (matchState.status === "EN JUEGO") {
            matchState.matchDuration++;
            const hours = Math.floor(matchState.matchDuration / 3600);
            const minutes = Math.floor((matchState.matchDuration % 3600) / 60);
            const seconds = matchState.matchDuration % 60;

            let timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            if (hours > 0) {
                timeString = `${hours}:${timeString}`;
            }

            document.getElementById('matchTimer').textContent = timeString;
        }
    }, 1000);
}

// Format time for display
function formatTime(date) {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// Award point to a team
function awardPoint(team) {
    team.points++;

    // Check if game is won (must win by 2 points after deuce)
    const diff = matchState.team1.points - matchState.team2.points;
    if ((team.points >= 4 && Math.abs(diff) >= 2)) {
        awardGame(team);
    }

    updateDisplay();
}

// Award game to a team
function awardGame(team) {
    team.games++;
    matchState.team1.points = 0;
    matchState.team2.points = 0;

    // Switch server
    matchState.team1.isServing = !matchState.team1.isServing;
    matchState.team2.isServing = !matchState.team2.isServing;

    // Check if set is won (must win by 2 games, minimum 6 games)
    const gamesDiff = matchState.team1.games - matchState.team2.games;
    if ((team.games >= 6 && Math.abs(gamesDiff) >= 2) || team.games === 7) {
        awardSet(team);
    }
}

// Award set to a team
function awardSet(team) {
    // Save set to history
    matchState.setHistory.push({
        team1: matchState.team1.games,
        team2: matchState.team2.games
    });

    team.sets++;
    matchState.team1.games = 0;
    matchState.team2.games = 0;

    // Check if match is won (best of 3)
    if (team.sets >= 2) {
        endMatch(team);
    }
}

// End match
function endMatch(winningTeam) {
    matchState.status = "FINALIZADO";
    clearInterval(matchState.timerInterval);
    updateDisplay();
}

// Demo Mode - Simulates a match for demonstration
function setupDemoMode() {
    // Uncomment the line below to enable demo mode with automatic score updates
    // startDemoMode();
}

function startDemoMode() {
    console.log("Demo mode started - scores will update automatically");

    setInterval(() => {
        if (matchState.status === "EN JUEGO") {
            // Randomly award points
            const team = Math.random() < 0.5 ? matchState.team1 : matchState.team2;
            awardPoint(team);
        }
    }, 3000); // Update every 3 seconds
}

// API Integration Point
// This function can be called to update the match state from an external source
function updateMatchState(newState) {
    Object.assign(matchState, newState);
    updateDisplay();
}

// WebSocket Integration Example (commented out - implement when backend is ready)
/*
function connectToWebSocket() {
    const ws = new WebSocket('ws://localhost:8080/match-updates');

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateMatchState(data);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectToWebSocket, 5000);
    };
}
*/

// Keyboard controls for testing (can be removed in production)
document.addEventListener('keydown', (event) => {
    if (matchState.status !== "EN JUEGO") return;

    switch(event.key) {
        case '1':
            awardPoint(matchState.team1);
            break;
        case '2':
            awardPoint(matchState.team2);
            break;
        case 'r':
            // Reset match
            location.reload();
            break;
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDisplay);

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateMatchState,
        awardPoint,
        matchState
    };
}
