// xp/window.js
import { apps } from './apps.js';
import { createTaskbarItem, removeTaskbarItem, updateTaskbarActiveState } from './taskbar.js';

let zIndexCounter = 100;
let activeWindow = null;
const openWindows = new Map();

function saveNotepadContent(windowEl) {
    const textarea = windowEl.querySelector('.notepad-textarea');
    const content = textarea.value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Untitled.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const titleBar = element.querySelector('.title-bar');

    if (titleBar) {
        titleBar.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        if (e.target.tagName === 'BUTTON' || element.classList.contains('maximized')) return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        setActive(element);
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const desktop = document.getElementById('desktop');
        const titleBar = document.querySelector('.title-bar');
        const titleBarHeight = titleBar ? titleBar.offsetHeight : 30;

        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        if (newTop < 0) newTop = 0;
        if (newLeft < 0) newLeft = 0;
        if (newTop > desktop.clientHeight - titleBarHeight) newTop = desktop.clientHeight - titleBarHeight;
        if (newLeft > desktop.clientWidth - element.clientWidth) newLeft = desktop.clientWidth - element.clientWidth;

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function makeResizable(element) {
    const handles = element.querySelectorAll('.resize-handle');
    let originalWidth, originalHeight, originalX, originalY, originalMouseX, originalMouseY;
    const minWidth = 250;
    const minHeight = 150;

    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            if (element.classList.contains('maximized')) return;
            e.preventDefault();
            e.stopPropagation();
            originalWidth = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
            originalHeight = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            originalX = element.getBoundingClientRect().left;
            originalY = element.getBoundingClientRect().top;
            originalMouseX = e.pageX;
            originalMouseY = e.pageY;
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        });
    });

    function resize(e) {
        const handleClasses = e.target.className;
        if (handleClasses.includes('e')) {
            const newWidth = originalWidth + (e.pageX - originalMouseX);
            if (newWidth > minWidth) element.style.width = newWidth + 'px';
        }
        if (handleClasses.includes('s')) {
            const newHeight = originalHeight + (e.pageY - originalMouseY);
            if (newHeight > minHeight) element.style.height = newHeight + 'px';
        }
        if (handleClasses.includes('w')) {
            const newWidth = originalWidth - (e.pageX - originalMouseX);
            if (newWidth > minWidth) {
                element.style.width = newWidth + 'px';
                element.style.left = (originalX + (e.pageX - originalMouseX)) + 'px';
            }
        }
        if (handleClasses.includes('n')) {
            const newHeight = originalHeight - (e.pageY - originalMouseY);
            if (newHeight > minHeight) {
                element.style.height = newHeight + 'px';
                element.style.top = (originalY + (e.pageY - originalMouseY)) + 'px';
            }
        }
    }

    function stopResize() {
        window.removeEventListener('mousemove', resize);
    }
    window.addEventListener('mouseup', stopResize);
}


function setActive(win) {
    if (activeWindow === win) return;

    if (activeWindow) {
        activeWindow.classList.remove('active');
    }
    document.querySelectorAll('.desktop-icon.active').forEach(icon => icon.classList.remove('active'));
    
    activeWindow = win;
    if (activeWindow) {
        activeWindow.classList.add('active');
        activeWindow.style.zIndex = zIndexCounter++;
        const appId = activeWindow.dataset.appId;
        const icon = document.querySelector(`.desktop-icon[data-app="${appId}"]`);
        if (icon) icon.classList.add('active');
    }
    updateTaskbarActiveState(activeWindow);
}


function toggleMinimize(win) {
    if (win.style.display === 'none') {
        win.style.display = 'flex';
        setActive(win);
    } else {
        win.style.display = 'none';
        if (activeWindow === win) {
            setActive(null);
        }
        updateTaskbarActiveState(null);
    }
}

function toggleMaximize(win) {
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        win.style.top = win.dataset.oldTop;
        win.style.left = win.dataset.oldLeft;
        win.style.width = win.dataset.oldWidth;
        win.style.height = win.dataset.oldHeight;
        win.querySelectorAll('.resize-handle').forEach(h => h.style.display = 'block');
    } else {
        win.dataset.oldTop = win.style.top;
        win.dataset.oldLeft = win.style.left;
        win.dataset.oldWidth = win.style.width;
        win.dataset.oldHeight = win.style.height;
        win.classList.add('maximized');
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = '100%';
        win.querySelectorAll('.resize-handle').forEach(h => h.style.display = 'none');
    }
}

function createWindow(appId) {
    const app = apps[appId];
    if (!app) return;

    if (openWindows.has(appId)) {
        const existingWindow = openWindows.get(appId);
        if (existingWindow.style.display === 'none') {
            toggleMinimize(existingWindow);
        }
        setActive(existingWindow);
        return;
    }

    const windowEl = document.createElement('div');
    windowEl.className = 'xp-window';
    windowEl.dataset.appId = appId;
    openWindows.set(appId, windowEl);

    const desktop = document.getElementById('desktop');
    const desktopRect = desktop.getBoundingClientRect();
    const maxWidth = Math.min(app.width || 640, desktopRect.width - 20);
    const maxHeight = Math.min(app.height || 480, desktopRect.height - 20);

    windowEl.style.width = `${maxWidth}px`;
    windowEl.style.height = `${maxHeight}px`;
    windowEl.style.left = `${Math.floor(Math.random() * Math.max(0, desktopRect.width - maxWidth - 10)) + 10}px`;
    windowEl.style.top = `${Math.floor(Math.random() * Math.max(0, desktopRect.height - maxHeight - 10)) + 10}px`;

    windowEl.innerHTML = `
        <div class="title-bar">
            <span class="title-bar-text"><img src="${app.icon}" class="title-bar-icon" alt=""/>${app.title}</span>
            <div class="title-bar-controls">
                <button class="minimize-btn" aria-label="Minimize">_</button>
                <button class="maximize-btn" aria-label="Maximize">[]</button>
                <button class="close-btn" aria-label="Close">X</button>
            </div>
        </div>
        <div class="window-body">${app.content}</div>
        <div class="resize-handle n"></div><div class="resize-handle s"></div><div class="resize-handle w"></div><div class="resize-handle e"></div>
        <div class="resize-handle nw"></div><div class="resize-handle ne"></div><div class="resize-handle sw"></div><div class="resize-handle se"></div>
    `;

    desktop.appendChild(windowEl);
    createTaskbarItem(appId, windowEl, windowActions);
    makeDraggable(windowEl);
    makeResizable(windowEl);
    setActive(windowEl);

    windowEl.addEventListener('mousedown', () => setActive(windowEl));
    windowEl.querySelector('.close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        windowEl.remove();
        openWindows.delete(appId);
        removeTaskbarItem(appId);
        if (activeWindow === windowEl) setActive(null);
    });
    windowEl.querySelector('.minimize-btn').addEventListener('click', (e) => e.stopPropagation() || toggleMinimize(windowEl));
    windowEl.querySelector('.maximize-btn').addEventListener('click', (e) => e.stopPropagation() || toggleMaximize(windowEl));
    windowEl.querySelector('.title-bar').addEventListener('dblclick', () => toggleMaximize(windowEl));

    if (appId === 'notepad') {
        windowEl.querySelector('.save-as').addEventListener('click', () => saveNotepadContent(windowEl));
        const textarea = windowEl.querySelector('.notepad-textarea');
        textarea.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveNotepadContent(windowEl); } });
    }
}

// Group actions to pass to other modules
export const windowActions = {
    createWindow,
    toggleMinimize,
    toggleMaximize,
    setActive,
    getActiveWindow: () => activeWindow,
};