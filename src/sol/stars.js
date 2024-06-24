// stars.js

import * as THREE from 'three';

export function createStars(numStars) {
    const stars = new THREE.Group();
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < numStars; i++) {
        const distance = THREE.MathUtils.randFloat(1000, 10000);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI / 2; // Limit to hemisphere

        const x = distance * Math.cos(theta) * Math.cos(phi);
        const y = distance * Math.sin(phi);
        const z = distance * Math.sin(theta) * Math.cos(phi);

        const size = THREE.MathUtils.randFloat(0.0001, 0.01);

        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const starField = new THREE.Points(starGeometry, starMaterial);

    stars.add(starField);

    return stars;
}