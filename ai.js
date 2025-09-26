import { addAiNews } from '../news.js';
import { renderNews } from '../ui/components.js';
import { escapeHTML, simulateApkBuild } from '../utils.js';

const aiNewsPool = [
    { title: "Rust 1.78 Released with Improved Compiler Performance", content: "The latest version of Rust focuses on optimizing compile times and enhancing diagnostic messages, making the development experience smoother." },
    { title: "WebAssembly 2.0 Draft Published", content: "The new WASM 2.0 draft introduces support for garbage collection, tail calls, and SIMD, opening up new possibilities for web performance." },
    { title: "AI Code Assistant 'CodeSynth' Now Understands Context", content: "A major update to CodeSynth allows it to analyze your entire project for more accurate and relevant code suggestions." },
    { title: "Vulkan vs. DirectX 12: New Benchmarks Revealed", content: "Recent benchmarks show Vulkan taking a slight lead in cross-platform performance for indie game developers, while DirectX 12 still dominates on Windows." },
    { title: "The Rise of Declarative UI in Mobile Development", content: "Frameworks like Jetpack Compose and SwiftUI are changing how developers build mobile interfaces, shifting from imperative to declarative paradigms." },
    { title: "Python 3.13 to Feature Optional JIT Compiler", content: "The upcoming Python release will include an experimental Just-In-Time compiler, promising significant performance boosts for CPU-bound tasks." },
];

export function generateAiNews() {
    const randomNews = aiNewsPool[Math.floor(Math.random() * aiNewsPool.length)];
    addAiNews(randomNews.title, randomNews.content);
    const aiNewsContainer = document.getElementById('ai-news-container');
    if (aiNewsContainer) {
       renderNews();
    }
}

export async function handleAiFileGeneration(event) {
    event.preventDefault();
    const promptInput = document.getElementById('ai-prompt-input');
    const fileNameInput = document.getElementById('file-name-input');
    const statusContainer = document.getElementById('ai-file-gen-status');
    const submitButton = event.target.querySelector('button[type="submit"]');

    const prompt = promptInput.value.trim();
    const fileName = fileNameInput.value.trim() || 'download';
    const selectedType = document.querySelector('input[name="file-type"]:checked').value;

    if (!prompt) {
        alert('Please enter a prompt for the AI.');
        return;
    }

    statusContainer.innerHTML = '<div class="loading-spinner"></div><p style="text-align:center;">AI is generating code...</p>';
    submitButton.disabled = true;

    try {
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert programmer AI. A user will give you a prompt, and you must generate code that fulfills the request. 
                    - Provide only the code, without any introductory text, explanations, or markdown fences like \\\`\\\`\\\`javascript.
                    - If the language isn't specified, default to the most likely language for the request.
                    - Ensure the code is clean, well-formatted, and directly usable.`
                },
                { role: "user", content: prompt }
            ]
        });

        const generatedCode = completion.content;

        const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${selectedType}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        statusContainer.innerHTML = `<p style="color: var(--success-color); text-align: center;">Download started successfully!</p>`;

    } catch (error) {
        console.error("AI File Generation Error:", error);
        statusContainer.innerHTML = `<p style="color: var(--error-color); text-align: center;">An error occurred while generating the file. Please try again.</p>`;
    } finally {
        submitButton.disabled = false;
        // Clear status message after a few seconds
        setTimeout(() => {
            if (statusContainer) statusContainer.innerHTML = '';
        }, 5000);
    }
}

export async function handleCodeGeneration(event) {
    event.preventDefault();
    const promptInput = document.getElementById('prompt-input');
    const resultsContainer = document.getElementById('code-generator-results');
    const submitButton = event.target.querySelector('button[type="submit"]');

    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
        alert('Please enter a prompt.');
        return;
    }

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '<div class="loading-spinner"></div><p style="text-align:center;">AI is generating your code...</p>';
    submitButton.disabled = true;

    try {
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert programmer AI. A user will give you a prompt, and you must generate code that fulfills the request. 
                    - Provide only the code, without any introductory text, explanations, or markdown fences like \\\`\\\`\\\`javascript.
                    - If the language isn't specified, default to JavaScript.
                    - Ensure the code is clean, well-formatted, and directly usable.`
                },
                { role: "user", content: userPrompt }
            ]
        });

        const generatedCode = completion.content;

        resultsContainer.innerHTML = `
            <h4>Generated Code:</h4>
            <pre id="code-output"><code>${escapeHTML(generatedCode)}</code></pre>
        `;

    } catch (error) {
        console.error("AI Code Generation Error:", error);
        resultsContainer.innerHTML = `<p style="color: var(--error-color);">An error occurred while generating code. Please try again later.</p>`;
    } finally {
        submitButton.disabled = false;
    }
}

export async function handleCodeSubmission(event) {
    event.preventDefault();
    const codeInput = document.getElementById('code-input');
    const resultsContainer = document.getElementById('builder-results');
    const submitButton = event.target.querySelector('button[type="submit"]');

    const userCode = codeInput.value.trim();
    if (!userCode) {
        alert('Please enter some code or pseudocode.');
        return;
    }

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '<div class="loading-spinner"></div><p style="text-align:center;">AI is analyzing your code...</p>';
    submitButton.disabled = true;

    try {
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an AI Software Builder assistant. Analyze the user's code or pseudocode.
                    Your goal is to describe a hypothetical mobile application based on the code.
                    Provide a creative app name, a version number (e.g., 1.0.0), a user-friendly description of the app's function, and one piece of constructive feedback on the provided code.
                    Respond ONLY with a JSON object following this schema:
                    {
                      "appName": string,
                      "version": string,
                      "description": string,
                      "feedback": string
                    }`
                },
                { role: "user", content: userCode }
            ],
            json: true,
        });

        const result = JSON.parse(completion.content);

        // Start the build simulation
        await new Promise(resolve => {
            simulateApkBuild(resultsContainer, resolve);
        });

        const apkFileName = `${result.appName.replace(/\s+/g, '_')}_v${result.version}.apk`;
        const apkFileContent = `This is a simulated APK file generated by DevHub AI.\n\nApp Name: ${result.appName}\nVersion: ${result.version}\n\n--- User Code Analyzed ---\n\n${userCode}`;
        const blob = new Blob([apkFileContent], { type: 'text/plain' });
        const downloadUrl = URL.createObjectURL(blob);

        resultsContainer.innerHTML = `
            <h4>Build Complete: ${escapeHTML(result.appName)}</h4>
            <p><strong>Version:</strong> ${escapeHTML(result.version)}</p>
            <p><strong>Description:</strong> ${escapeHTML(result.description)}</p>
            <p class="feedback"><strong>AI Feedback:</strong> ${escapeHTML(result.feedback)}</p>
            <a href="${downloadUrl}" download="${apkFileName}" class="btn btn-primary btn-auto" style="margin-top: 1rem;">Download Signed APK</a>
        `;

    } catch (error) {
        console.error("AI Builder Error:", error);
        resultsContainer.innerHTML = `<p style="color: var(--error-color);">An error occurred while building. The AI might be unavailable. Please try again later.</p>`;
    } finally {
        submitButton.disabled = false;
    }
}

export async function handleTranslation(event) {
    event.preventDefault();
    const persianInput = document.getElementById('persian-input');
    const resultsContainer = document.getElementById('translator-results');
    const outputElement = document.getElementById('english-output');
    const submitButton = event.target.querySelector('button[type="submit"]');

    const persianText = persianInput.value.trim();
    if (!persianText) {
        alert('Please enter some Persian text to translate.');
        return;
    }

    resultsContainer.style.display = 'block';
    outputElement.innerHTML = '<div class="loading-spinner" style="margin: 0 auto;"></div>';
    submitButton.disabled = true;

    try {
        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert translator. The user will provide text in Persian. Translate it to English. Provide ONLY the English translation, without any explanations, introductions, or quotation marks."
                },
                { role: "user", content: persianText }
            ]
        });

        const translation = completion.content;

        outputElement.innerText = translation;

    } catch (error) {
        console.error("Translation Error:", error);
        outputElement.innerHTML = `<span style="color: var(--error-color);">An error occurred during translation. Please try again.</span>`;
    } finally {
        submitButton.disabled = false;
    }
}

export async function handleCodeOptimization(event) {
    const codeInput = document.getElementById('code-analyzer-input');
    const statusContainer = document.getElementById('code-analyzer-status');
    const optimizeButton = document.getElementById('optimize-code-btn');
    const runButton = document.getElementById('run-code-btn');

    const userCode = codeInput.value.trim();
    if (!userCode) {
        alert('Please enter some code to optimize.');
        return;
    }

    statusContainer.innerHTML = '<div class="loading-spinner"></div><p style="text-align:center;">AI is optimizing your code...</p>';
    optimizeButton.disabled = true;
    runButton.disabled = true;

    try {
        const completion = await websim.chat.completions.create({
            messages: [{
                role: "system",
                content: `You are an expert AI code optimizer. You will receive a piece of code.
- Analyze it for syntax errors, logical errors, and inefficiencies.
- Correct any errors found.
- Optimize the code for performance and readability.
- Refactor it to follow modern best practices and conventions for its language.
- Your response must be ONLY the final, corrected, and optimized code. Do not include any explanations, introductory text, or markdown code fences.`
            }, {
                role: "user",
                content: userCode
            }]
        });

        const optimizedCode = completion.content;
        codeInput.value = optimizedCode;
        statusContainer.innerHTML = `<p style="color: var(--success-color); text-align: center;">Code optimized successfully!</p>`;

    } catch (error) {
        console.error("AI Optimization Error:", error);
        statusContainer.innerHTML = `<p style="color: var(--error-color); text-align: center;">An error occurred during optimization. Please try again.</p>`;
    } finally {
        optimizeButton.disabled = false;
        runButton.disabled = false;
        setTimeout(() => {
            if (statusContainer) statusContainer.innerHTML = '';
        }, 5000);
    }
}

export function handleCodeExecution(event) {
    const codeInput = document.getElementById('code-analyzer-input');
    const outputContainer = document.getElementById('code-analyzer-output-container');
    const outputElement = document.getElementById('code-analyzer-output');
    const statusContainer = document.getElementById('code-analyzer-status');
    
    outputContainer.style.display = 'block';
    outputElement.textContent = '';
    statusContainer.innerHTML = '';

    const userCode = codeInput.value;
    if (!userCode.trim()) {
        outputElement.textContent = 'No code to run.';
        return;
    }

    // Capture console.log output
    const logs = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        // Convert all arguments to string representations
        const formattedArgs = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch (e) {
                    return '[Unserializable Object]';
                }
            }
            return String(arg);
        });
        logs.push(formattedArgs.join(' '));
        originalConsoleLog.apply(console, args); // Also log to the actual console
    };

    try {
        // Use the Function constructor for safer, isolated execution
        const runnable = new Function(userCode);
        const result = runnable();

        // Restore console.log
        console.log = originalConsoleLog;

        let output = logs.join('\n');
        if (result !== undefined) {
            output += `\n\n[Return Value]: ${result}`;
        }
        
        outputElement.textContent = output || '[No output produced]';
        statusContainer.innerHTML = `<p style="color: var(--success-color); text-align: center;">Execution finished.</p>`;

    } catch (error) {
        console.log = originalConsoleLog; // Ensure console.log is restored on error
        outputElement.textContent = `[Error]: ${error.name}\n${error.message}`;
        outputElement.style.color = 'var(--error-color)';
        statusContainer.innerHTML = `<p style="color: var(--error-color); text-align: center;">Execution failed with an error.</p>`;
    } finally {
         setTimeout(() => {
            if (statusContainer) statusContainer.innerHTML = '';
            if(outputElement) outputElement.style.color = 'var(--primary-text)';
        }, 5000);
    }
}