const room = new WebsimSocket();
const websitesCollection = room.collection('websites_v2');

const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Site</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to My Website!</h1>
    </header>
    <main>
        <p>This is a paragraph on my new site.</p>
        <p>You can edit this content in the DevHub Website Builder.</p>
    </main>
    <script src="script.js"><\/script>
</body>
</html>`;

const defaultCSS = `body {
    font-family: sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

header {
    background-color: #333;
    color: #fff;
    padding: 1rem;
    text-align: center;
    border-radius: 5px;
}

main {
    margin-top: 1rem;
    padding: 1rem;
    background: #fff;
    border-radius: 5px;
}`;

const defaultJS = `console.log("Welcome to the site!");

// You can add your JavaScript here.
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header h1');
    header.addEventListener('click', () => {
        alert('You clicked the header!');
    });
});`;

let currentUser;
let userSite;

async function fetchUserSite() {
    if (!currentUser) currentUser = await window.websim.getCurrentUser();
    const sites = await websitesCollection.filter({ userId: currentUser.id }).getList();
    userSite = sites.length > 0 ? sites[0] : null;
}

function updatePreview() {
    const html = document.getElementById('html-editor').value;
    const css = document.getElementById('css-editor').value;
    const js = document.getElementById('js-editor').value;
    const iframe = document.getElementById('preview-iframe');

    const srcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}<\/script>
        </body>
        </html>
    `;
    iframe.srcdoc = srcDoc;
}

function setupEditorTabs() {
    const tabs = document.querySelectorAll('.editor-tab');
    const editors = document.querySelectorAll('.code-editor');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            editors.forEach(e => e.classList.remove('active'));

            tab.classList.add('active');
            const editorId = tab.dataset.editor;
            document.getElementById(editorId).classList.add('active');
        });
    });
}

async function handleCreateSite(container) {
    const createButton = document.getElementById('create-site-btn');
    createButton.disabled = true;
    createButton.textContent = 'Creating...';

    const newUserSite = {
        userId: currentUser.id,
        username: currentUser.username,
        htmlContent: defaultHTML,
        cssContent: defaultCSS,
        jsContent: defaultJS
    };

    userSite = await websitesCollection.create(newUserSite);
    renderWebsiteBuilderPage(container);
}

async function handlePublish() {
    const publishButton = document.getElementById('publish-btn');
    const statusEl = document.getElementById('publish-status');
    publishButton.disabled = true;
    statusEl.innerHTML = `Publishing...`;

    const updatedSite = {
        htmlContent: document.getElementById('html-editor').value,
        cssContent: document.getElementById('css-editor').value,
        jsContent: document.getElementById('js-editor').value,
    };

    await websitesCollection.update(userSite.id, updatedSite);
    
    // Simulate AI deployment
    const steps = [
        "Connecting to hosting server...",
        "Authenticating...",
        "Uploading files...",
        "Verifying paths and permissions...",
        "Purging cache...",
        "Deployment successful!"
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i < steps.length) {
            statusEl.innerHTML = `<span style="color: #ccc;">${steps[i]}</span>`;
            i++;
        } else {
            clearInterval(interval);
            const siteUrl = `${window.baseUrl}#/site/${currentUser.username}`;
            statusEl.innerHTML = `✅ Site is live at: <a href="${siteUrl}" target="_blank">${siteUrl}</a>`;
            publishButton.disabled = false;
        }
    }, 700);
}

async function handleAiTemplate() {
    const promptInput = document.getElementById('ai-prompt');
    const generateBtn = document.getElementById('ai-generate-btn');
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Please enter a prompt for the AI.');
        return;
    }

    promptInput.disabled = true;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
        const completion = await websim.chat.completions.create({
            messages: [{
                role: 'system',
                content: `You are an AI web developer. The user wants a new website template. Based on their prompt, generate a complete, self-contained, simple website.
                Respond ONLY with a JSON object with three keys: "html", "css", and "js". The HTML should link to "style.css" and "script.js". The JS should be simple and demonstrate interactivity.`
            }, {
                role: 'user',
                content: prompt
            }],
            json: true
        });

        const result = JSON.parse(completion.content);
        document.getElementById('html-editor').value = result.html || '';
        document.getElementById('css-editor').value = result.css || '';
        document.getElementById('js-editor').value = result.js || '';
        updatePreview();
    } catch (error) {
        console.error('AI Template generation failed:', error);
        alert('An error occurred while generating the template. Please try again.');
    } finally {
        promptInput.disabled = false;
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
    }
}


function renderEditor(container) {
    const siteUrl = `${window.baseUrl}#/site/${currentUser.username}`;
    container.innerHTML = `
        <div class="container">
            <h2>Website Builder</h2>
            <div class="website-builder-container">
                <div class="editor-pane">
                    <h3>Code Editor</h3>
                    <div class="editor-tabs">
                        <button class="editor-tab active" data-editor="html-editor">index.html</button>
                        <button class="editor-tab" data-editor="css-editor">style.css</button>
                        <button class="editor-tab" data-editor="js-editor">script.js</button>
                    </div>
                    <div class="editor-content">
                        <textarea id="html-editor" class="code-editor active" spellcheck="false">${userSite.htmlContent}</textarea>
                        <textarea id="css-editor" class="code-editor" spellcheck="false">${userSite.cssContent}</textarea>
                        <textarea id="js-editor" class="code-editor" spellcheck="false">${userSite.jsContent}</textarea>
                    </div>
                </div>
                <div class="preview-pane">
                    <h3>Live Preview</h3>
                    <iframe id="preview-iframe" class="preview-iframe"></iframe>
                </div>
            </div>
            <div class="builder-actions">
                <button id="preview-btn" class="btn btn-primary btn-auto">Update Preview</button>
                <button id="publish-btn" class="btn btn-primary btn-auto">Publish Changes</button>
                <p id="publish-status">Your site is live at: <a href="${siteUrl}" target="_blank">${siteUrl}</a></p>
            </div>

            <div class="ai-template-form">
                <h4>✨ Change Template with AI</h4>
                <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #ccc;">Describe the kind of website you want, and the AI will generate a new template for you.</p>
                <div class="form-group">
                    <input type="text" id="ai-prompt" placeholder="e.g., a simple portfolio for a photographer">
                    <button id="ai-generate-btn" class="btn btn-primary btn-auto">Generate</button>
                </div>
            </div>
        </div>
    `;

    setupEditorTabs();
    updatePreview();

    document.getElementById('preview-btn').addEventListener('click', updatePreview);
    document.getElementById('publish-btn').addEventListener('click', handlePublish);
    document.getElementById('ai-generate-btn').addEventListener('click', handleAiTemplate);
}

function renderCreateScreen(container) {
    container.innerHTML = `
        <div class="container">
            <h2>Website Builder</h2>
            <div class="builder-container" style="display: block; height: auto;">
                <div class="builder-content" style="text-align: center; padding: 4rem 2rem;">
                    <h3>You don't have a website yet.</h3>
                    <p style="margin-bottom: 2rem; color: #ccc;">Click the button below to create your first site with a default template.</p>
                    <button id="create-site-btn" class="btn btn-primary">Create Your Website</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('create-site-btn').addEventListener('click', () => handleCreateSite(container));
}


export async function renderWebsiteBuilderPage(container) {
    container.innerHTML = `<div class="loading-spinner"></div>`;
    await fetchUserSite();
    if (userSite) {
        renderEditor(container);
    } else {
        renderCreateScreen(container);
    }
}