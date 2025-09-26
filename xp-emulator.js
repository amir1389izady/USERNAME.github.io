import { apps } from './xp/apps.js';
import { initAudio, playStartupSound, updateClock, handleOrientationChange } from './xp/system.js';
import { windowActions } from './xp/window.js';
import { initTaskbar } from './xp/taskbar.js';

export function renderXpEmulatorPage(container) {
    container.innerHTML = `
        <div id="xp-emulator-root">
            <a href="#/" class="back-to-site-btn">Exit XP Mode</a>
            <main id="desktop">
                ${Object.keys(apps).map(appId => {
                    const app = apps[appId];
                    // Only create desktop icons for a subset of apps for a cleaner desktop
                    if (['myComputer', 'recycleBin', 'mario', 'minecraft', 'idle', 'notepad', 'minesweeper', 'solitaire', 'paint'].includes(appId)) {
                        return `
                            <div class="desktop-icon" data-app="${appId}">
                                <img src="${app.icon}" alt="${app.title}">
                                <span>${app.title}</span>
                            </div>
                        `;
                    }
                    return '';
                }).join('')}
            </main>
            <footer id="taskbar"></footer>
        </div>
    `;

    const desktop = document.getElementById('desktop');

    // Initialize modules
    initTaskbar(windowActions);
    initAudio().then(playStartupSound);

    // Desktop-level event listeners
    desktop.addEventListener('click', (e) => {
        // Deactivate active icon if clicking directly on desktop
        if (e.target.id === 'desktop') {
            document.querySelectorAll('.desktop-icon.active').forEach(icon => icon.classList.remove('active'));
        }
    });

    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const appId = icon.dataset.app;
            windowActions.createWindow(appId);
        });
    });

    updateClock();
    setInterval(updateClock, 1000 * 30); // Update every 30 seconds

    window.addEventListener('resize', handleOrientationChange, false);
    window.addEventListener('orientationchange', handleOrientationChange, false);
    handleOrientationChange();
}