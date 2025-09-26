import { isUserLoggedIn } from '../../userAuth.js';

export function renderXpEmulatorLinkSection() {
    if (!isUserLoggedIn()) {
        return '';
    }

    return `
        <div class="xp-emulator-link-section builder-section">
            <h2>Windows XP Emulator</h2>
            <div class="builder-container">
                <h3>Launch the Classic Desktop Experience</h3>
                <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #ccc;">
                    Relive the golden age of computing with our interactive Windows XP simulation. Includes classic apps and games.
                </p>
                <a href="#/xp" class="btn btn-primary btn-auto">Launch Windows XP</a>
            </div>
        </div>
    `;
}

