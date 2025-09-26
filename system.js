// xp/system.js
let audioContext;
let startupSoundBuffer;

export async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch('xp-startup.mp3');
        const arrayBuffer = await response.arrayBuffer();
        startupSoundBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
        console.error("Failed to initialize audio:", e);
    }
}

export function playStartupSound() {
    if (!audioContext || !startupSoundBuffer) return;
    // User interaction is required to play audio. We'll attach it to the first click/mousedown in the emulator.
    const play = () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const source = audioContext.createBufferSource();
        source.buffer = startupSoundBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        document.body.removeEventListener('mousedown', play, true);
        document.body.removeEventListener('touchstart', play, true);
    };
    document.body.addEventListener('mousedown', play, true);
    document.body.addEventListener('touchstart', play, true);
}


export function updateClock() {
    const clockEl = document.getElementById('taskbar-clock');
    if (clockEl) {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clockEl.textContent = time;
    }
}

export function handleOrientationChange() {
    const overlay = document.getElementById('orientation-lock-overlay');
    if (!overlay) return;

    if (window.matchMedia("(orientation: portrait)").matches && window.innerWidth < 768) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}