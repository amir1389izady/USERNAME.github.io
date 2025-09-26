import { isUserLoggedIn } from '../../userAuth.js';

export function renderSoftwareBuilderSection() {
    if (!isUserLoggedIn()) {
        return `
        <div class="builder-section">
             <h2>AI Software Builder</h2>
            <div class="upload-prompt">
                <p><a href="#/user-login">Log in</a> to use the AI Software Builder.</p>
            </div>
        </div>
        `;
    }

    return `
        <div class="builder-section">
            <h2>AI Software Builder</h2>
            <div class="builder-container">
                <h3>Provide Your Code</h3>
                <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #ccc;">Enter your code (e.g., JavaScript, Python, pseudocode) and our AI will analyze it, describe the potential application, and generate a simulated APK file for download.</p>
                <form id="software-builder-form">
                    <div class="form-group">
                        <label for="code-input">Code / Pseudocode</label>
                        <textarea id="code-input" required placeholder="function main() {\n  console.log('Hello, Developer!');\n}"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-auto">Build APK</button>
                </form>
                <div id="builder-results">
                    <!-- AI results will be injected here -->
                </div>
            </div>
        </div>
    `;
}