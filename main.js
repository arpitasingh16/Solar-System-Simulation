import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPlanet , createOrbitRing} from './planets/PlanetFactory.js';
import { planetData } from './planets/PlanetData.js';

let scene, camera, renderer, controls, clock;
const planets = [];


init();
animate();

function init() {
  scene = new THREE.Scene();

// 🎇 Background image (distant stars or nebula)
const backgroundTexture = new THREE.TextureLoader().load('/textures/space2.jpg');
backgroundTexture.encoding = THREE.sRGBEncoding; 
scene.background = backgroundTexture;

// 🌌 Star field sphere (360 surround)
const starsTexture = new THREE.TextureLoader().load('/textures/space1.jpg');
starsTexture.encoding = THREE.sRGBEncoding;
const starsGeometry = new THREE.SphereGeometry(500, 64, 64);
const starsMaterial = new THREE.MeshBasicMaterial({
  map: starsTexture,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.5 // Blend softly with background
});
const starField = new THREE.Mesh(starsGeometry, starsMaterial);
scene.add(starField);


  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 150);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  


  // OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 40;
  controls.maxDistance = 300;
  controls.enablePan = false;

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Increased intensity
scene.add(ambientLight);

// Point light: acts like the Sun's glow
const sunLight = new THREE.PointLight(0xffffff, 2, 1000); // Increased range
sunLight.position.set(0, 0, 0); // Important: place at center (same as Sun)
scene.add(sunLight);

  // Sun (textured)
  const sunTexture = new THREE.TextureLoader().load('/textures/sun_hd.jpg');
  const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sunGeo = new THREE.SphereGeometry(10, 64, 64);
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // Planets + orbits
  planetData.forEach(data => {
    const planet = createPlanet(data);
    scene.add(planet.pivot);
    planets.push({
      ...planet,
      orbitSpeed: 0.4 + Math.random() * 0.5,
      spinSpeed: 0.8 + Math.random() * 0.6
    });

    const orbit = createOrbitRing(data.distance);
    scene.add(orbit);
  });

  clock = new THREE.Clock();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  planets.forEach(planet => {
    planet.pivot.rotation.y += delta * planet.orbitSpeed;
    planet.mesh.rotation.y += delta * planet.spinSpeed;
  });

  controls.update();
  renderer.render(scene, camera);
}

