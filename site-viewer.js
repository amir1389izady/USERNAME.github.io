const room = new WebsimSocket();
const websitesCollection = room.collection('websites_v2');

export async function renderSiteViewerPage(container, username) {
    container.innerHTML = `<div class="loading-spinner"></div>`;

    try {
        const sites = await websitesCollection.filter({ username: username }).getList();

        if (sites.length === 0) {
            container.innerHTML = `
                <div class="container" style="text-align: center; padding-top: 4rem;">
                    <h2>Site Not Found</h2>
                    <p>No website has been published for the user '${username}'.</p>
                    <a href="#/" class="btn btn-primary btn-auto" style="margin-top: 1rem;">Back to DevHub</a>
                </div>
            `;
            return;
        }

        const site = sites[0];
        const { htmlContent, cssContent, jsContent } = site;

        // The entire page content is now the user's site, rendered in an iframe
        // to isolate its styles and scripts from the main DevHub app.
        const srcDoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${cssContent}</style>
            </head>
            <body>
                ${htmlContent.replace(/<\/script>/g, '<\\/script>')}
                <script>${jsContent.replace(/<\/script>/g, '<\\/script>')}<\/script>
            </body>
            </html>
        `;

        container.style.padding = '0';
        container.style.margin = '0';
        container.innerHTML = `
            <iframe 
                srcdoc="${srcDoc.replace(/"/g, '&quot;')}" 
                style="width: 100%; height: 100vh; border: none; margin: 0; padding: 0;"
                sandbox="allow-scripts allow-same-origin">
            </iframe>
        `;

    } catch (error) {
        console.error("Error loading site:", error);
        container.innerHTML = `
            <div class="container" style="text-align: center; padding-top: 4rem;">
                <h2>Error Loading Site</h2>
                <p>There was a problem loading this website. Please try again later.</p>
                 <a href="#/" class="btn btn-primary btn-auto" style="margin-top: 1rem;">Back to DevHub</a>
            </div>
        `;
    }
}