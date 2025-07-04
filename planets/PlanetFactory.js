import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function createPlanet({ name, size, distance, color, texture }) {
  const pivot = new THREE.Object3D();

  const geometry = new THREE.SphereGeometry(size, 64, 64);

  let material;

  if (texture) {
    const planetTexture = textureLoader.load(`/textures/${texture}`);
    planetTexture.encoding = THREE.sRGBEncoding; 
    material = new THREE.MeshStandardMaterial({ map: planetTexture });
  } else {
    material = new THREE.MeshStandardMaterial({ color });
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = distance;
  pivot.add(mesh);

  // 🪐 Saturn ring
  if (name.toLowerCase() === 'saturn') {
    const ringTexture = textureLoader.load('/textures/saturn_ring2.jpg');
    ringTexture.encoding = THREE.sRGBEncoding; 

    const ringGeo = new THREE.RingGeometry(size + 1, size + 4, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.x = distance;
    pivot.add(ring);
  }

  return { name, pivot, mesh };
}

export function createOrbitRing(radius) {
  const segments = 128;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
  
  return new THREE.LineLoop(geometry, material);
}


