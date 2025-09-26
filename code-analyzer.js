import { isUserLoggedIn } from '../../userAuth.js';

export function renderCodeAnalyzerSection() {
    if (!isUserLoggedIn()) {
        return `
        <div class="builder-section">
             <h2>Code Analyzer & Optimizer</h2>
            <div class="upload-prompt">
                <p><a href="#/user-login">Log in</a> to use the AI Code Analyzer.</p>
            </div>
        </div>
        `;
    }

    return `
        <div class="code-analyzer-section builder-section">
            <h2>Code Analyzer & Optimizer</h2>
            <div class="builder-container">
                <h3>Analyze, Optimize, and Run Your Code</h3>
                <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #ccc;">
                    Enter any programming code below. The AI can optimize it for best practices, or you can run JavaScript code directly in the browser.
                </p>
                <div id="code-analyzer-editor-container">
                    <div class="code-editor-toolbar">
                        <button id="optimize-code-btn" class="btn btn-primary btn-auto">Optimize</button>
                        <button id="run-code-btn" class="btn btn-primary btn-auto">Run (JS Only)</button>
                    </div>
                    <textarea id="code-analyzer-input" placeholder="Paste your code here..."></textarea>
                </div>
                <div id="code-analyzer-status" style="margin-top: 1rem;"></div>
                <div id="code-analyzer-output-container" style="margin-top: 1.5rem; display: none;">
                    <h4>Output:</h4>
                    <pre id="code-analyzer-output"></pre>
                </div>
            </div>
        </div>
    `;
}

