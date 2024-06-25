import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createStars } from './stars.js'; // Import de la fonction createStars

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Function to create a celestial object with texture
function createCelestialObject(size, texturePath) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const object = new THREE.Mesh(geometry, material);
    return object;
}

// Function to create a satellite
function createSatellite(parentPlanet, size, color, distance, speed) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const satellite = new THREE.Mesh(geometry, material);

    satellite.userData = {
        distance: distance,
        speed: speed,
        angle: Math.random() * Math.PI * 2,
        parentPlanet: parentPlanet
    };

    parentPlanet.add(satellite);

    return satellite;
}

// Create the Sun
const sun = createCelestialObject(25, 'textures/burning_sun.png'); // Adjusted scale for the Sun
scene.add(sun);

// Create planets with orbit information
const planetsData = [
    { size: 0.1, texture: 'textures/mercury.jpeg', distance: 20, speed: 0.004 },  // Mercury
    { size: 0.2, texture: 'textures/venus.jpeg', distance: 30, speed: 0.003 },    // Venus
    { size: 0.2, texture: 'textures/earth.jpeg', distance: 40, speed: 0.002 },    // Earth
    { size: 0.1, texture: 'textures/mars.jpeg', distance: 50, speed: 0.008 },    // Mars
    { size: 3, texture: 'textures/jupiter.jpeg', distance: 70, speed: 0.005 },    // Jupiter
    { size: 2.5, texture: 'textures/saturn.jpeg', distance: 90, speed: 0.008 },  // Saturn
    { size: 1.1, texture: 'textures/uranus.jpeg', distance: 110, speed: 0.007 }, // Uranus
    { size: 1, texture: 'textures/neptune.jpeg', distance: 130, speed: 0.006 },  // Neptune
    { size: 0.05, texture: 'textures/pluto.jpg', distance: 150, speed: 0.004 }, // Pluto
];

const planets = planetsData.map(data => {
    const planet = createCelestialObject(data.size, data.texture);
    planet.userData = { distance: data.distance, speed: data.speed, angle: Math.random() * Math.PI * 2 };
    scene.add(planet);
    return planet;
});

/* const jupiterSatellite1 = createSatellite(planets[4], 0.02, 0xffff00, 5, 0.03);
const jupiterSatellite2 = createSatellite(planets[4], 0.015, 0xff00ff, 7, 0.02);

const saturnSatellite1 = createSatellite(planets[5], 0.015, 0x00ffff, 6, 0.035);
const saturnSatellite2 = createSatellite(planets[5], 0.01, 0xff0000, 8, 0.025);

const earthSatellite1 = createSatellite(planets[2], 0.005, 0x00ff00, 3, 0.05);
const earthSatellite2 = createSatellite(planets[2], 0.004, 0x0000ff, 4, 0.04);

 */

const distantStars = createStars(20000);
scene.add(distantStars);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 200;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Lights

// Ajout d'une lumière ponctuelle pour simuler la lumière du Soleil
const pointLight = new THREE.PointLight(0xffffff, 2, 3000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Animation loop
const animate = () => {
    // Update planet positions
    planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x = planet.userData.distance * Math.cos(planet.userData.angle);
        planet.position.z = planet.userData.distance * Math.sin(planet.userData.angle);
    });

    // Update satellite positions
    planets.forEach(planet => {
        planet.children.forEach(satellite => {
            satellite.userData.angle += satellite.userData.speed;
            satellite.position.x = satellite.userData.distance * Math.cos(satellite.userData.angle);
            satellite.position.z = satellite.userData.distance * Math.sin(satellite.userData.angle);
        });
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();

// Update sizes on resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
