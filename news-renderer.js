import { getNews } from '../../news.js';
import { escapeHTML } from '../../utils.js';

export function renderNews() {
    const allNews = getNews();
    const aiNews = allNews.filter(n => n.type === 'ai');
    const adminNews = allNews.filter(n => n.type === 'admin');

    const aiContainer = document.getElementById('ai-news-container');
    const adminContainer = document.getElementById('admin-news-container');

    if (!aiContainer || !adminContainer) return;

    aiContainer.innerHTML = `<h3>AI News Feed</h3>` + (aiNews.length > 0 ? aiNews.map(item => `
        <div class="news-item">
            <p class="news-item-title">${escapeHTML(item.title)}</p>
            <p class="news-item-content">${escapeHTML(item.content)}</p>
            <p class="news-item-meta">${item.timestamp.toLocaleDateString()} ${item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    `).join('') : '<p>No AI news available.</p>');

    adminContainer.innerHTML = `<h3>Admin Announcements</h3>` + (adminNews.length > 0 ? adminNews.map(item => `
        <div class="news-item">
            <p class="news-item-title">${escapeHTML(item.title)}</p>
            <p class="news-item-content">${escapeHTML(item.content)}</p>
            <p class="news-item-meta">${item.timestamp.toLocaleDateString()} ${item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    `).join('') : '<p>No announcements from admin.</p>');
}