let models = [];
let nextId = 1;

export function getModels() {
    return [...models].sort((a, b) => b.timestamp - a.timestamp);
}

export function addModel(fileName, fileURL, uploaderEmail) {
    if (!fileName || !fileURL || !uploaderEmail) return;

    const model = {
        id: nextId++,
        fileName: fileName,
        fileURL: fileURL,
        uploaderEmail: uploaderEmail,
        timestamp: new Date(),
    };
    models.push(model);
}