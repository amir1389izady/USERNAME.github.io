export function renderFileConverterSection() {
    const fileTypes = [
        { name: 'Python', ext: 'py' },
        { name: 'JavaScript', ext: 'js' },
        { name: 'HTML', ext: 'html' },
        { name: 'CSS', ext: 'css' },
        { name: 'Java', ext: 'java' },
        { name: 'C++', ext: 'cpp' },
        { name: 'C#', ext: 'cs' },
        { name: 'PHP', ext: 'php' },
        { name: 'Ruby', ext: 'rb' },
        { name: 'Go', ext: 'go' },
        { name: 'Rust', ext: 'rs' },
        { name: 'Plain Text', ext: 'txt' },
    ];

    return `
        <div class="file-converter-section builder-section">
            <h2>AI Code to File Generator</h2>
            <div class="builder-container">
                <h3>Generate a downloadable code file from a prompt</h3>
                <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #ccc;">
                    Describe the code you need in the prompt box. The AI will generate it, and you can download it as a file. This tool is available for guests.
                </p>
                <form id="file-converter-form">
                    <div class="file-converter-form-layout">
                        <div class="file-converter-main-inputs">
                            <div class="form-group">
                                <label for="ai-prompt-input">Your Prompt</label>
                                <textarea id="ai-prompt-input" rows="10" required placeholder="e.g., 'a python function that sorts a list of dictionaries by a specific key'"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="file-name-input">File Name (without extension)</label>
                                <input type="text" id="file-name-input" value="my_file" required placeholder="e.g., my_script">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Select File Type</label>
                             <div id="file-type-select" class="file-converter-types">
                                ${fileTypes.map((type, index) => `
                                    <label class="file-type-label ${index === 0 ? 'selected' : ''}">
                                        <input type="radio" name="file-type" value="${type.ext}" ${index === 0 ? 'checked' : ''}>
                                        ${type.name} (.${type.ext})
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-auto" style="margin-top: 1rem;">Generate & Download</button>
                    <div id="ai-file-gen-status" style="margin-top: 1rem;"></div>
                </form>
            </div>
        </div>
    `;
}