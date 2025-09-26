import { isUserLoggedIn } from '../../userAuth.js';

export function renderTranslatorSection() {
    if (!isUserLoggedIn()) {
        return '';
    }

    return `
        <div class="translator-section builder-section">
            <h2>Persian to English Translator</h2>
            <div class="builder-container">
                <h3>Enter Persian Text</h3>
                <form id="translator-form">
                    <div class="form-group">
                        <label for="persian-input">Persian Text</label>
                        <textarea id="persian-input" rows="4" required placeholder="متن فارسی خود را اینجا وارد کنید..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-auto">Translate</button>
                </form>
                <div id="translator-results" style="margin-top: 2rem; display: none;">
                    <h4>English Translation:</h4>
                    <p id="english-output" style="background-color: var(--primary-bg); padding: 1rem; border-radius: 4px; border: 1px solid var(--border-color); min-height: 50px; white-space: pre-wrap;"></p>
                </div>
            </div>
        </div>
    `;
}

