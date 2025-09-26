export function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

export async function simulateApkBuild(container, onComplete) {
    const steps = [
        "Reviewing project Gradle files...",
        "Compiling Java/Kotlin code to .class files...",
        "Converting .class files to Dalvik Executable (.dex)...",
        "Processing resources with AAPT2...",
        "Merging AndroidManifest.xml...",
        "Packaging outputs into APK file...",
        "Signing APK with debug key...",
        "Build successful. APK is ready for download."
    ];

    container.innerHTML = `<div class="build-log">${steps.map(s => `<p>${s}</p>`).join('')}</div>`;
    const logItems = container.querySelectorAll('.build-log p');

    function runStep(index) {
        if (index >= steps.length) {
            if (onComplete) onComplete();
            return;
        }

        // Mark previous as success
        if (index > 0) {
            logItems[index - 1].classList.remove('running');
            logItems[index - 1].classList.add('success');
        }

        // Mark current as running
        logItems[index].classList.add('running');
        if (index === steps.length - 1) { // Final success message
             logItems[index].classList.add('final-success');
        }

        const delay = index === steps.length - 1 ? 1000 : 1200 + Math.random() * 500;
        setTimeout(() => runStep(index + 1), delay);
    }

    runStep(0);
}