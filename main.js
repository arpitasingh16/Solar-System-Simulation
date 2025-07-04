import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPlanet, createOrbitRing } from './planets/PlanetFactory.js';
import { planetData } from './planets/PlanetData.js';
import { setupSpeedControls, orbitSpeeds } from './ui/SpeedControl.js';
import { initLabelSystem, updateLabels } from './ui/LabelSystem.js';



let scene, camera, renderer, controls, clock;
const planets = [];

init();
animate();

function init() {
  scene = new THREE.Scene();

  //Static background
  const backgroundTexture = new THREE.TextureLoader().load('/textures/space2.jpg');
  backgroundTexture.encoding = THREE.sRGBEncoding;
  scene.background = backgroundTexture;

  //Star sphere
  const starsTexture = new THREE.TextureLoader().load('/textures/space1.jpg');
  starsTexture.encoding = THREE.sRGBEncoding;
  const starsGeometry = new THREE.SphereGeometry(500, 64, 64);
  const starsMaterial = new THREE.MeshBasicMaterial({
    map: starsTexture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.5
  });
  const starField = new THREE.Mesh(starsGeometry, starsMaterial);
  scene.add(starField);

  //Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 150);
  camera.lookAt(0, 0, 0);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  //OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 40;
  controls.maxDistance = 300;
  controls.enablePan = false;

  //Window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  //Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  //Sun
  const sunTexture = new THREE.TextureLoader().load('/textures/sun_hd.jpg');
  sunTexture.encoding = THREE.sRGBEncoding;
  const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sunGeo = new THREE.SphereGeometry(10, 64, 64);
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  //Planets and orbits
  planetData.forEach(data => {
    const planet = createPlanet(data);
    scene.add(planet.pivot);
    planets.push({
      ...planet,
      spinSpeed: 0.8 + Math.random() * 0.6,
    });

    scene.add(createOrbitRing(data.distance));
  });

  //Set up speed control UI
  const planetNames = planetData.map(p => p.name);
  setupSpeedControls(planetNames);
  initLabelSystem(camera, planets);


  clock = new THREE.Clock();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  planets.forEach(planet => {
    const speed = orbitSpeeds[planet.name] || 0.5;
    planet.pivot.rotation.y += delta * speed;
    planet.mesh.rotation.y += delta * planet.spinSpeed;
  });

  controls.update();
  renderer.render(scene, camera);
  updateLabels();
}
