import { isUserLoggedIn } from '../../userAuth.js';
import { escapeHTML } from '../../utils.js';

export function renderGamesSection() {
    if (!isUserLoggedIn()) {
        return `
        <div class="games-section builder-section">
             <h2>Online Games</h2>
            <div class="upload-prompt">
                <p><a href="#/user-login">Log in</a> to play online games.</p>
            </div>
        </div>
        `;
    }

    const games = [
        { name: '2048', link: 'https://play2048.co/', icon: '🔢' },
        { name: 'Tetris', link: 'https://tetris.com/play-tetris', icon: '🧱' },
        { name: 'Snake', link: 'https://playsnake.org/', icon: '🐍' },
        { name: 'Pac-Man', link: 'https://www.google.com/search?q=pacman', icon: '🟡' },
        { name: 'Asteroids', link: 'https://www.freeasteroids.org/', icon: '☄️' },
        { name: 'Flappy Bird', link: 'https://flappybird.io/', icon: '🐦' },
        { name: 'Solitaire', link: 'https://www.google.com/search?q=solitaire', icon: '🃏' },
        { name: 'Minesweeper', link: 'https://minesweeperonline.com/', icon: '💣' },
        { name: 'Connect Four', link: 'https://www.mathsisfun.com/games/connect4.html', icon: '🔵' },
        { name: 'Chess', link: 'https://www.chess.com/play/computer', icon: '♟️' },
    ];

    return `
        <div class="games-section builder-section">
            <h2>Online Games</h2>
            <div class="games-container">
                ${games.map(game => `
                    <a href="${game.link}" target="_blank" rel="noopener noreferrer" class="game-card">
                        <div class="game-icon">${game.icon}</div>
                        <div class="game-name">${escapeHTML(game.name)}</div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}