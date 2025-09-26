import { isUserLoggedIn } from '../../userAuth.js';

export function renderUploadSection() {
    if (!isUserLoggedIn()) {
        return `
        <div class="upload-prompt">
            <p><a href="#/user-login">Log in</a> to upload your own 3D models and other creations.</p>
        </div>
        `;
    }

    return `
        <div class="upload-container">
            <h3>Upload Your Creations</h3>
            <form id="upload-form" class="upload-form">
                <div class="form-group">
                    <label for="model-upload">Upload a 3D Model (GLB, GLTF)</label>
                    <input type="file" id="model-upload" name="model-upload" accept=".glb, .gltf">
                </div>
                 <div class="form-group">
                    <label for="photo-upload">Upload a Photo (PNG, JPG) - Demo</label>
                    <input type="file" id="photo-upload" name="photo-upload" accept="image/png, image/jpeg">
                </div>
                <div class="form-group">
                    <label for="audio-upload">Upload Audio (MP3, WAV) - Demo</label>
                    <input type="file" id="audio-upload" name="audio-upload" accept="audio/mpeg, audio/wav">
                </div>
                <button type="submit" class="btn btn-primary">Upload Files</button>
            </form>
        </div>
    `;
}

