import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let currentModel;
const loader = new GLTFLoader();

export function loadModel(url) {
    if (currentModel) {
        scene.remove(currentModel);
    }

    loader.load(url, (gltf) => {
        currentModel = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(currentModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim; // Scale to fit in a 2.5 unit box

        currentModel.position.sub(center.multiplyScalar(scale));
        currentModel.scale.set(scale, scale, scale);

        scene.add(currentModel);
        controls.autoRotate = false;
    }, undefined, (error) => {
        console.error('An error happened while loading the model:', error);
        alert('Failed to load the 3D model.');
    });
}

export function initThree(canvas) {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    // Camera
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Default Geometry & Material
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00bcd4,
        metalness: 0.3,
        roughness: 0.6,
        wireframe: true,
    });
    currentModel = new THREE.Mesh(geometry, material);
    scene.add(currentModel);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Increased intensity
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0xffffff, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xffffff, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        if (currentModel && controls.autoRotate) {
             currentModel.rotation.y += 0.005;
        }
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    function onResize() {
        const container = canvas.parentElement;
        if(container) {
            const width = container.clientWidth;
            const height = 400; // fixed height
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }
    window.addEventListener('resize', onResize);
    onResize(); // Initial call
}