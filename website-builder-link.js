import { isUserLoggedIn } from '../../userAuth.js';

export function renderWebsiteBuilderLinkSection() {
    if (!isUserLoggedIn()) {
        return '';
    }

    return `
        <div class="website-builder-link-section builder-section">
            <h2>AI Website Builder</h2>
            <div class="builder-container">
                <h3>Create and Publish Your Own Website</h3>
                <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #ccc;">
                    Use our simple editor and powerful AI to build and host a personal website. No coding experience required to start.
                </p>
                <a href="#/website-builder" class="btn btn-primary btn-auto">Open Website Builder</a>
            </div>
        </div>
    `;
}

