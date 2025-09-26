// A lightweight in-memory + localStorage-backed message store and chat UI initializer.
// Replaces external "db" usage and provides getMessages, addMessage, deleteMessage exports.

const STORAGE_KEY = 'devhub_messages_v1';

let messages = loadMessages();
let nextId = (messages.reduce((max, m) => Math.max(max, m.id || 0), 0) || 0) + 1;
let subscribers = [];

function loadMessages() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        // Ensure timestamps are Date objects
        return parsed.map(m => ({
            id: m.id,
            author: m.author,
            content: m.content,
            timestamp: new Date(m.timestamp)
        }));
    } catch (e) {
        console.error('Failed to load messages from storage', e);
        return [];
    }
}

function saveMessages() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
        console.error('Failed to save messages', e);
    }
}

function notifySubscribers() {
    subscribers.forEach(fn => {
        try { fn(getMessages()); } catch (e) { console.error(e); }
    });
}

// Public API
export function getMessages() {
    // Return a copy sorted ascending by timestamp
    return [...messages].sort((a, b) => a.timestamp - b.timestamp);
}

export function addMessage(author, content) {
    if (!content || !String(content).trim()) return null;
    const msg = {
        id: nextId++,
        author: (author && String(author).trim()) || 'Anonymous',
        content: String(content).trim(),
        timestamp: new Date()
    };
    messages.push(msg);
    saveMessages();
    notifySubscribers();
    return msg;
}

export function deleteMessage(id) {
    const before = messages.length;
    messages = messages.filter(m => m.id !== id);
    if (messages.length !== before) {
        saveMessages();
        notifySubscribers();
        return true;
    }
    return false;
}

export function subscribeMessages(fn) {
    if (typeof fn === 'function') {
        subscribers.push(fn);
        // Immediately call with current data
        try { fn(getMessages()); } catch (e) { console.error(e); }
        return () => {
            subscribers = subscribers.filter(f => f !== fn);
        };
    }
    return () => {};
}

/* If the page includes the simple chat UI (legacy/top-level chat in index.html),
   initialize it so it behaves similarly to the previous db-backed code. */
function setupTopLevelChat() {
    const messagesBox = document.getElementById("messages");
    const input = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const usernameInput = document.getElementById("username");

    if (!messagesBox || !input || !sendBtn || !usernameInput) return;

    function renderToBox(list) {
        messagesBox.innerHTML = "";
        list.forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            const div = document.createElement("div");
            div.style.marginBottom = "8px";
            // safe-escape simple insertion
            const author = escapeHTML(msg.author || 'Anonymous');
            const content = escapeHTML(msg.content || '');
            div.innerHTML = `<strong>${author}</strong> <small style='color:#888'>(${time})</small>: ${content}`;
            messagesBox.appendChild(div);
        });
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // Subscribe to future updates
    subscribeMessages(renderToBox);

    // Send handler
    sendBtn.addEventListener('click', () => {
        const author = usernameInput.value.trim() || 'Anonymous';
        const content = input.value.trim();
        if (!content) return;
        addMessage(author, content);
        input.value = '';
    });

    // Enter to send (on input)
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

// Initialize top-level chat if DOM already loaded, otherwise wait for load.
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // small timeout to allow other scripts to attach DOM nodes
    setTimeout(setupTopLevelChat, 0);
} else {
    window.addEventListener('DOMContentLoaded', setupTopLevelChat);
}