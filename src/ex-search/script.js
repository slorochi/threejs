// Importer Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.137.5/build/three.module.js';

// Importer OrbitControls pour pouvoir naviguer dans la scène
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.137.5/examples/jsm/controls/OrbitControls.js';

// Créer la scène
const scene = new THREE.Scene();

// Créer la caméra
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Créer le renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Créer un shader material
const vertexShader = `
    varying vec3 vPosition;
    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vPosition;
    void main() {
        gl_FragColor = vec4(vPosition * 0.5 + 0.5, 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

// Créer les mesh
const geometry1 = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry1, shaderMaterial);
cube.position.x = -2;
scene.add(cube);

const geometry2 = new THREE.SphereGeometry(0.75, 32, 32);
const sphere = new THREE.Mesh(geometry2, shaderMaterial);
scene.add(sphere);

const geometry3 = new THREE.TorusGeometry(0.75, 0.2, 16, 100);
const torus = new THREE.Mesh(geometry3, shaderMaterial);
torus.position.x = 2;
scene.add(torus);

// Ajouter les contrôles d'orbite
const controls = new OrbitControls(camera, renderer.domElement);

// Animer la scène
const animate = function () {
    requestAnimationFrame(animate);

    // Animer les mesh
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
};

animate();

// Ajuster la taille du renderer en cas de redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
