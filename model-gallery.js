import { getModels } from '../../models.js';
import { escapeHTML } from '../../utils.js';
import { loadModel } from '../three-scene.js';

export function renderModelGallery(container) {
    const allModels = getModels();
    if (allModels.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #888;">No 3D models have been uploaded yet.</p>`;
        return;
    }
    container.innerHTML = allModels.map(model => `
        <div class="model-card" data-url="${model.fileURL}">
            <div class="model-icon">🧬</div>
            <div class="model-info">
                <span class="model-name">${escapeHTML(model.fileName)}</span>
                <span class="model-author">by ${escapeHTML(model.uploaderEmail)}</span>
            </div>
        </div>
    `).join('');

    // Add event listeners after rendering
    container.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('click', () => {
            const url = card.dataset.url;
            loadModel(url);
        });
    });
}