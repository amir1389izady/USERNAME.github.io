import { isUserLoggedIn } from '../../userAuth.js';

export function renderCodeGeneratorSection() {
    if (!isUserLoggedIn()) {
        return `
        <div class="code-generator-section builder-section">
             <h2>AI Code Generator</h2>
            <div class="upload-prompt">
                <p><a href="#/user-login">Log in</a> to use the AI Code Generator.</p>
            </div>
        </div>
        `;
    }

    return `
        <div class="code-generator-section builder-section">
            <h2>AI Code Generator</h2>
            <div class="builder-container">
                <h3>Describe What You Want to Code</h3>
                <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #ccc;">Enter a description of the functionality you need, and our AI will generate the code for you.</p>
                <form id="code-generator-form">
                    <div class="form-group">
                        <label for="prompt-input">Your Prompt</label>
                        <textarea id="prompt-input" rows="4" required placeholder="e.g., 'a javascript function that sorts an array of objects by a specific key'"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-auto">Generate Code</button>
                </form>
                <div id="code-generator-results" style="display: none; margin-top: 2rem;">
                    <!-- AI results will be injected here -->
                </div>
            </div>
        </div>
    `;
}