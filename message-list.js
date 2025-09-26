import { getMessages } from '../../messages.js';
import { escapeHTML } from '../../utils.js';

export function renderMessageList(container) {
    const allMessages = getMessages();
    if (allMessages.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #888;">No messages yet. Be the first!</p>`;
        return;
    }
    container.innerHTML = allMessages.map(msg => `
        <div class="message">
            <p class="message-content">${escapeHTML(msg.content)}</p>
            <div class="message-meta">
                <span class="message-author">${escapeHTML(msg.author)}</span>
                <span class="message-time">${msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    `).join('');
}

