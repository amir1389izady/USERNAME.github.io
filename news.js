let news = [
    { id: 1, type: 'admin', title: 'Welcome to the New DevHub!', content: 'We are excited to launch our new platform. Explore, create, and connect!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 2, type: 'ai', title: 'New JavaScript Framework "Fluxor" Gaining Traction', content: 'Developers are buzzing about Fluxor, a lightweight framework promising reactive UI with minimal boilerplate.', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 3, type: 'admin', title: 'Community Guidelines Update', content: 'We have updated our community guidelines. Please take a moment to review them on the new "Guidelines" page.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) }
];
let nextId = 4;

export function getNews() {
    return [...news].sort((a, b) => b.timestamp - a.timestamp);
}

export function addAdminNews(title, content) {
    if (!title.trim() || !content.trim()) return;
    const newsItem = {
        id: nextId++,
        type: 'admin',
        title: title.trim(),
        content: content.trim(),
        timestamp: new Date()
    };
    news.push(newsItem);
}

export function addAiNews(title, content) {
    if (!title.trim() || !content.trim()) return;
    const newsItem = {
        id: nextId++,
        type: 'ai',
        title: title.trim(),
        content: content.trim(),
        timestamp: new Date()
    };
    news.push(newsItem);
}