import { getMessages, deleteMessage } from './messages.js';
import { addAdminNews } from './news.js';

const room = new WebsimSocket();
const visitsCollection = room.collection('visits_v1');

let channels = [
    { id: 1, name: 'Artificial Intelligence' },
    { id: 2, name: 'Game Development' },
    { id: 3, name: 'Web3 & Blockchain' },
    { id: 4, name: 'Software Engineering' },
];

let nextId = 5;
let visitCount = Math.floor(Math.random() * (25000 - 5000 + 1)) + 5000;

function renderChannelList(listElement) {
    listElement.innerHTML = channels.map(channel => `
        <li data-id="${channel.id}">
            <span class="channel-name">${channel.name}</span>
            <span class="channel-actions">
                <button class="edit-btn" title="Edit">✏️</button>
                <button class="delete-btn" title="Delete">🗑️</button>
            </span>
        </li>
    `).join('');
}

function handleChannelActions(listElement) {
    listElement.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;
        
        const id = parseInt(li.dataset.id, 10);

        if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this channel?')) {
                channels = channels.filter(c => c.id !== id);
                renderAdminPanel(document.getElementById('app-root'));
            }
        } else if (target.classList.contains('edit-btn')) {
            const channel = channels.find(c => c.id === id);
            const newName = prompt('Enter new channel name:', channel.name);
            if (newName && newName.trim() !== '') {
                channel.name = newName.trim();
                renderAdminPanel(document.getElementById('app-root'));
            }
        }
    });
}

function renderAdminMessageList(container) {
    const allMessages = getMessages();
    if (allMessages.length === 0) {
        container.innerHTML = '<li>No user messages found.</li>';
        return;
    }
    container.innerHTML = allMessages.map(msg => `
        <li data-id="${msg.id}">
            <div class="admin-message-content">
                <strong>${escapeHTML(msg.author || 'Anonymous')}:</strong>
                <p>${escapeHTML(msg.content)}</p>
                <span class="admin-message-time">${msg.timestamp.toLocaleString()}</span>
            </div>
            <button class="delete-btn" title="Delete Message">🗑️</button>
        </li>
    `).join('');
}

function handleMessageActions(listElement, parentContainer) {
    listElement.addEventListener('click', e => {
        if (e.target.classList.contains('delete-btn')) {
            const li = e.target.closest('li');
            const id = parseInt(li.dataset.id, 10);
            if (confirm('Are you sure you want to delete this message?')) {
                deleteMessage(id);
                renderAdminPanel(parentContainer);
            }
        }
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

function updateTelegramStatus(message) {
    const statusEl = document.getElementById('telegram-status');
    if (statusEl) {
        statusEl.innerHTML = `
            <p><strong>Status:</strong> <span style="color: var(--success-color);">Message sent successfully!</span></p>
            <p><strong>Last Post:</strong> "${escapeHTML(message)}" at ${new Date().toLocaleTimeString()}</p>
        `;
        setTimeout(() => {
             const statusP = statusEl.querySelector('p:first-child');
             if(statusP) statusP.innerHTML = `<strong>Status:</strong> Idle`;
        }, 4000);
    }
}

export function renderAdminPanel(container) {
    container.innerHTML = `
        <div class="container">
            <h2>Admin Management Panel</h2>
            <div class="admin-dashboard">
                <div class="dashboard-card">
                    <h3>Total Site Visits (Sessions)</h3>
                    <p id="total-visits-stat" class="stat-item">...</p>
                </div>
                <div class="dashboard-card">
                    <h3>Live Visitors</h3>
                    <p id="live-visitors-stat" class="stat-item">...</p>
                </div>
                <div class="dashboard-card">
                    <h3>Members</h3>
                    <p class="stat-item">4,281</p>
                </div>
                <div class="dashboard-card" style="grid-column: 1 / -1;">
                    <h3>Post News Announcement</h3>
                    <form id="news-form">
                        <div class="form-group">
                            <label for="news-title">Title</label>
                            <input type="text" id="news-title" name="news-title" required>
                        </div>
                        <div class="form-group">
                            <label for="news-content">Content</label>
                            <textarea id="news-content" name="news-content" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-auto">Post News</button>
                    </form>
                </div>
                <div class="dashboard-card" style="grid-column: 1 / -1;">
                    <h3>Manage Channels</h3>
                    <ul id="channel-list" class="channel-list"></ul>
                    <form id="add-channel-form" class="add-channel-form">
                        <input type="text" id="new-channel-name" placeholder="New channel name..." required>
                        <button type="submit">Add Channel</button>
                    </form>
                </div>
                <div class="dashboard-card" style="grid-column: 1 / -1;">
                    <h3>Message Users</h3>
                    <form id="message-form">
                        <div class="form-group">
                            <label for="message-content">Broadcast Message</label>
                            <textarea id="message-content" name="message-content" rows="5" placeholder="Type your message to all users..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-auto">Send Broadcast</button>
                    </form>
                </div>
                <div class="dashboard-card" style="grid-column: 1 / -1;">
                    <h3>User Messages</h3>
                    <ul id="admin-message-list" class="admin-message-list"></ul>
                </div>
                <div class="dashboard-card" style="grid-column: 1 / -1;">
                    <h3>Telegram Bot Control</h3>
                    <p class="telegram-bot-description">
                        Manage automated posts to your Telegram channel: <a href="https://t.me/amirdsdv" target="_blank" rel="noopener noreferrer">https://t.me/amirdsdv</a>
                    </p>
                    <form id="telegram-form">
                        <div class="form-group">
                            <label for="telegram-message">Custom Message</label>
                            <textarea id="telegram-message" name="telegram-message" rows="4" placeholder="Type a message to send to the channel..."></textarea>
                        </div>
                        <div class="telegram-actions">
                            <button type="submit" class="btn btn-primary btn-auto">Send Custom Message</button>
                            <button type="button" id="send-daily-btn" class="btn btn-primary btn-auto">Send Daily Announcement</button>
                        </div>
                    </form>
                    <div id="telegram-status" class="telegram-status">
                        <p><strong>Status:</strong> Idle</p>
                        <p><strong>Last Post:</strong> None</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const totalVisitsEl = document.getElementById('total-visits-stat');
    const liveVisitorsEl = document.getElementById('live-visitors-stat');

    // Subscribe to total visits
    const unsubVisits = visitsCollection.subscribe(visits => {
        if (totalVisitsEl) {
            totalVisitsEl.textContent = (visits?.length ?? 0).toLocaleString();
        }
    });

    // Subscribe to presence for live visitors
    const unsubPresence = room.subscribe('presence', (users) => {
        if (liveVisitorsEl) {
            liveVisitorsEl.textContent = (Object.keys(users ?? {}).length).toLocaleString();
        }
    });

    // Simple cleanup for when the view changes, though this app doesn't have a component lifecycle
    const observer = new MutationObserver((mutations) => {
        if (!document.body.contains(container)) {
            unsubVisits();
            unsubPresence();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    const channelListElement = document.getElementById('channel-list');
    renderChannelList(channelListElement);
    handleChannelActions(channelListElement);
    
    const adminMessageList = document.getElementById('admin-message-list');
    renderAdminMessageList(adminMessageList);
    handleMessageActions(adminMessageList, container);
    
    document.getElementById('add-channel-form').addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('new-channel-name');
        const name = input.value.trim();
        if (name) {
            channels.push({ id: nextId++, name });
            input.value = '';
            renderAdminPanel(container);
        }
    });

    document.getElementById('message-form').addEventListener('submit', e => {
        e.preventDefault();
        const messageContent = document.getElementById('message-content');
        const message = messageContent.value.trim();
        if (message) {
            alert(`Message sent to all users:\n\n"${message}"`);
            messageContent.value = '';
        } else {
            alert('Please enter a message to send.');
        }
    });

    document.getElementById('news-form').addEventListener('submit', e => {
        e.preventDefault();
        const titleInput = document.getElementById('news-title');
        const contentInput = document.getElementById('news-content');
        const title = titleInput.value;
        const content = contentInput.value;

        if (title && content) {
            addAdminNews(title, content);
            alert('News has been posted successfully!');
            titleInput.value = '';
            contentInput.value = '';
            
            // Simulate sending news to Telegram
            const telegramMessage = `📢 New Announcement: ${title}\n\n${content.substring(0, 150)}...\n\nRead more: ${window.location.origin}`;
            updateTelegramStatus(telegramMessage);
        } else {
            alert('Please fill out both title and content.');
        }
    });
    
    // Telegram Bot Controls
    document.getElementById('telegram-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('telegram-message');
        const message = messageInput.value.trim();
        if (message) {
            updateTelegramStatus(message);
            messageInput.value = '';
        } else {
            alert('Please enter a message to send.');
        }
    });

    document.getElementById('send-daily-btn').addEventListener('click', () => {
        const dailyMessages = [
            "Good morning, developers! What are you building today? 💻",
            "Daily Tip: Don't forget to take breaks and stretch. A healthy mind codes better!",
            "Did you know? The first computer programmer was Ada Lovelace. #CodingHistory",
            "Stay curious and keep learning! Every line of code is a step forward.",
            "Challenge of the day: Try to refactor a piece of your old code. Can you make it better?"
        ];
        const randomMessage = dailyMessages[Math.floor(Math.random() * dailyMessages.length)];
        updateTelegramStatus(randomMessage);
    });
}