export function renderApkDownloadSection() {
    return `
        <div class="apk-download-section builder-section">
            <h2>Download DevHub as an App</h2>
            <div class="builder-container">
                <h3>Install DevHub on Your Device</h3>
                <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #ccc;">
                    Get the complete DevHub experience by downloading our simulated Android application (APK). Access all features directly from your home screen.
                </p>
                <button id="download-apk-btn" class="btn btn-primary btn-auto">Download DevHub.apk</button>
                <div id="apk-download-status" style="margin-top: 1rem;"></div>
            </div>
        </div>
    `;
}

