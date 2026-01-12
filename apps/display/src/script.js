function renamePlayer(name, team, player) {
  const playerNameContainer = document.getElementById(`player-${team}-${player}`);
  playerNameContainer.querySelectorAll('span').forEach((el) => {
    el.innerHTML = name;
  });
}

function updateTime() {
  const now = new Date();

  // Format as HH:MM (24-hour)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const timeDiv = document.getElementById('currentTime');
  if (timeDiv) {
    timeDiv.textContent = `${hours}:${minutes}`;
  }

  // Calculate ms until next full minute
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(updateTime, msToNextMinute);
}

// Start immediately
updateTime();

// Set main content
function setMainSection(id) {
  document.querySelectorAll('main > section').forEach((section) => {
    section.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

function setFooterMessage(message) {
  document.getElementById('footerMessage').innerHTML = message;
}

// Theme toggle handler
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

// Loading state handlers
function clearPageLoading() {
  document.body.classList.remove('page-loading');
}

function showPageLoading() {
  document.body.classList.add('page-loading');
}

// Padel point scoring display values
const PADEL_POINTS = ['0', '15', '30', '40', 'AD'];

const STATUS_MAP = {
  idle: 'WAITING',
  pending_start: 'READY',
  in_game: 'IN GAME',
  finished: 'FINISHED',
};

function getPadelPointDisplay(points, opponentPoints) {
  if (points < 3) return PADEL_POINTS[points];
  if (points >= 4 && points > opponentPoints) return 'AD';
  return '40';
}

// Update game state on the display
function updateGameState(gameState) {
  if (!gameState) return;

  // Update court status
  const statusElement = document.getElementById('courtStatus');
  if (statusElement) {
    statusElement.textContent = STATUS_MAP[gameState.status] || '';
  }

  // Update theme
  if (gameState.preferredTheme) {
    setTheme(gameState.preferredTheme);
  }

  // Update player names
  gameState.players.forEach((team, teamIndex) => {
    team.forEach((player, playerIndex) => {
      const playerNameElement = document.getElementById(
        `playerName-T${teamIndex + 1}P${playerIndex + 1}`
      );
      if (playerNameElement) {
        playerNameElement.textContent = player.name || `Player ${playerIndex + 1}`;
      }
    });
    clearTeamLoading(teamIndex + 1);
  });

  // Update scores
  const matchState = gameState.matchState;

  // Update game points
  const team1Points = getPadelPointDisplay(
    matchState.currentGamePoints[0],
    matchState.currentGamePoints[1]
  );
  const team2Points = getPadelPointDisplay(
    matchState.currentGamePoints[1],
    matchState.currentGamePoints[0]
  );

  const gamePointsT1 = document.getElementById('gamePointsValue-T1');
  const gamePointsT2 = document.getElementById('gamePointsValue-T2');
  if (gamePointsT1) gamePointsT1.textContent = team1Points;
  if (gamePointsT2) gamePointsT2.textContent = team2Points;

  // Update games
  const gamesT1 = document.getElementById('gamesValue-T1');
  const gamesT2 = document.getElementById('gamesValue-T2');
  if (gamesT1) gamesT1.textContent = matchState.currentSetGames[0];
  if (gamesT2) gamesT2.textContent = matchState.currentSetGames[1];

  // Update sets
  const setsWonT1 = matchState.sets.filter((set) => set[0] > set[1]).length;
  const setsWonT2 = matchState.sets.filter((set) => set[1] > set[0]).length;

  const setsT1 = document.getElementById('setsValue-T1');
  const setsT2 = document.getElementById('setsValue-T2');
  if (setsT1) setsT1.textContent = setsWonT1;
  if (setsT2) setsT2.textContent = setsWonT2;

  // Update server indicator
  document.querySelectorAll('.player').forEach((player) => {
    player.classList.remove('serving');
  });

  const servingTeam = matchState.servingTeam + 1;
  const servingPlayer = matchState.servingPlayer + 1;
  const servingPlayerElement = document.getElementById(`player-T${servingTeam}P${servingPlayer}`);
  if (servingPlayerElement) {
    servingPlayerElement.classList.add('serving');
  }

  clearPageLoading();
}

// Connect to Socket.IO server
const API_URL = 'http://localhost:3000';
const socket = io(API_URL);

socket.on('connect', () => {
  console.log('Connected to server');
  clearPageLoading();
});

socket.on('gameState', (gameState) => {
  updateGameState(gameState);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  showPageLoading();
});
