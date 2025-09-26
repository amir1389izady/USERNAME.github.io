import { addMessage } from './messages.js';
import { isUserLoggedIn, getCurrentUserEmail } from './userAuth.js';
import { addModel } from './models.js';
import { initThree, loadModel } from './ui/three-scene.js';
import { 
    renderFileConverterSection,
    renderUploadSection,
    renderCodeGeneratorSection,
    renderSoftwareBuilderSection,
    renderTranslatorSection,
    renderCodeAnalyzerSection,
    renderGamesSection,
    renderApkDownloadSection,
    renderXpEmulatorLinkSection,
    renderWebsiteBuilderLinkSection,
    renderMessageList,
    renderModelGallery,
    renderNews
} from './ui/components.js';
import { 
    generateAiNews,
    handleAiFileGeneration, 
    handleCodeGeneration, 
    handleCodeSubmission, 
    handleTranslation,
    handleCodeOptimization,
    handleCodeExecution
} from './api/ai.js';
import { simulateApkBuild } from './utils.js';

let aiNewsInterval = null;

export function renderProgrammingPage(container) {
    container.innerHTML = `
        <div class="container">
            <div class="home-content">
                <div class="intro-text">
                    <h2>Welcome to DevHub</h2>
                    <p>A collaborative space for game and software developers. Share your projects, find collaborators, and explore new technologies.</p>
                    <p>Our platform grows through member contributions. Click a model from the gallery below to view it here.</p>
                </div>
                <div class="three-container">
                     <canvas id="three-canvas"></canvas>
                </div>
            </div>

            <div class="creations-gallery">
                <h2>3D Model Gallery</h2>
                <div id="model-gallery-container" class="model-gallery-container">
                    <!-- 3D Models will be rendered here -->
                </div>
            </div>

            <div class="news-section">
                <h2>Latest News & Announcements</h2>
                <div class="news-container">
                    <div id="ai-news-container" class="news-column">
                        <!-- AI News will be rendered here -->
                    </div>
                    <div id="admin-news-container" class="news-column">
                        <!-- Admin News will be rendered here -->
                    </div>
                </div>
            </div>

            ${renderFileConverterSection()}

            ${renderUploadSection()}

            ${renderCodeGeneratorSection()}

            ${renderSoftwareBuilderSection()}

            ${renderCodeAnalyzerSection()}

            <div class="community-feed">
                <h2>Community Feed</h2>
                <div class="feed-content">
                    <div class="message-form-container">
                        <h3>Leave an Anonymous Message</h3>
                        <form id="new-message-form">
                            <div class="form-group">
                                <label for="message-text">Message</label>
                                <textarea id="message-text" rows="4" required placeholder="What's on your mind?"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Post Message</button>
                        </form>
                    </div>
                    <div id="message-list-container" class="message-list-container">
                        <!-- Messages will be rendered here -->
                    </div>
                </div>
            </div>
            
            ${renderTranslatorSection()}

            ${renderGamesSection()}
            
            ${renderApkDownloadSection()}

            ${renderXpEmulatorLinkSection()}

            ${renderWebsiteBuilderLinkSection()}
        </div>
    `;

    // Defer Three.js initialization to ensure the canvas is fully rendered in the DOM.
    // This prevents the "Error creating WebGL context" error.
    setTimeout(() => {
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
            initThree(canvas);
        } else {
            console.error('Could not find canvas element for Three.js');
        }
    }, 0);

    const messageListContainer = document.getElementById('message-list-container');
    const messageForm = document.getElementById('new-message-form');
    const modelGalleryContainer = document.getElementById('model-gallery-container');

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const contentInput = document.getElementById('message-text');
        
        // Author is passed as empty string, messages.js will set it to 'Anonymous'
        addMessage('', contentInput.value); 
        
        contentInput.value = '';
        renderMessageList(messageListContainer);
    });

    const downloadApkBtn = document.getElementById('download-apk-btn');
    if (downloadApkBtn) {
        downloadApkBtn.addEventListener('click', () => {
            downloadApkBtn.disabled = true;
            const statusContainer = document.getElementById('apk-download-status');
            
            simulateApkBuild(statusContainer, () => {
                const apkContent = `
This is a simulated APK file for DevHub.

To access DevHub, please visit the website in your browser:
${window.location.origin}${window.location.pathname}

Instructions:
1. Open your web browser on your device.
2. Navigate to the URL above.
3. For an app-like experience, use your browser's "Add to Home Screen" feature.

Enjoy using DevHub!
                `;
                const blob = new Blob([apkContent.trim()], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'DevHub_v1.0_signed.apk';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                setTimeout(() => {
                   downloadApkBtn.disabled = false; 
                }, 3000);
            });
        });
    }

    // Event listener for guest users
    const fileConverterForm = document.getElementById('file-converter-form');
    if (fileConverterForm) {
        fileConverterForm.addEventListener('submit', handleAiFileGeneration);

        const typeSelector = document.getElementById('file-type-select');
        typeSelector.addEventListener('change', (e) => {
            // Manages the 'selected' class for styling the active radio button's label
            const labels = typeSelector.querySelectorAll('.file-type-label');
            labels.forEach(label => label.classList.remove('selected'));
            
            const selectedRadio = e.target;
            if (selectedRadio && selectedRadio.closest('.file-type-label')) {
                selectedRadio.closest('.file-type-label').classList.add('selected');
            }
        });
    }

    if (isUserLoggedIn()) {
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const modelFile = document.getElementById('model-upload').files[0];

                if (modelFile) {
                    const fileURL = URL.createObjectURL(modelFile);
                    addModel(modelFile.name, fileURL, getCurrentUserEmail());
                    renderModelGallery(modelGalleryContainer); // Refresh gallery
                    loadModel(fileURL); // Load the new model immediately
                }

                // Demo alert for other file types
                const photoFile = document.getElementById('photo-upload').files[0];
                const audioFile = document.getElementById('audio-upload').files[0];
                let message = 'Demo uploads:\\n';
                if (photoFile) message += `- Photo: ${photoFile.name}\\n`;
                if (audioFile) message += `- Audio: ${audioFile.name}\\n`;
                if(photoFile || audioFile) alert(message);

                if (!modelFile && !photoFile && !audioFile) {
                    alert('Please select at least one file to upload.');
                } else {
                     uploadForm.reset();
                }
            });
        }

        const builderForm = document.getElementById('software-builder-form');
        if (builderForm) {
            builderForm.addEventListener('submit', handleCodeSubmission);
        }

        const generatorForm = document.getElementById('code-generator-form');
        if (generatorForm) {
            generatorForm.addEventListener('submit', handleCodeGeneration);
        }

        const translatorForm = document.getElementById('translator-form');
        if (translatorForm) {
            translatorForm.addEventListener('submit', handleTranslation);
        }

        const optimizeBtn = document.getElementById('optimize-code-btn');
        if (optimizeBtn) {
            optimizeBtn.addEventListener('click', handleCodeOptimization);
        }
        
        const runBtn = document.getElementById('run-code-btn');
        if (runBtn) {
            runBtn.addEventListener('click', handleCodeExecution);
        }
    }

    renderMessageList(messageListContainer);
    renderModelGallery(modelGalleryContainer);
    renderNews();

    if (aiNewsInterval) {
        clearInterval(aiNewsInterval);
    }
    // Update every 30s for demo purposes.
    aiNewsInterval = setInterval(generateAiNews, 30000);
}