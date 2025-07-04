import * as THREE from 'three';

let labelEl;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let cameraRef;
let planetsRef = [];

export function initLabelSystem(camera, planets) {
  cameraRef = camera;
  planetsRef = planets;

  labelEl = document.createElement('div');
  labelEl.style.position = 'absolute';
  labelEl.style.color = 'white';
  labelEl.style.padding = '4px 8px';
  labelEl.style.background = 'rgba(0,0,0,0.7)';
  labelEl.style.borderRadius = '4px';
  labelEl.style.display = 'none';
  labelEl.style.pointerEvents = 'none';
  labelEl.style.zIndex = 100;
  document.body.appendChild(labelEl);

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Store current mouse position
    labelEl.dataset.mx = e.clientX;
    labelEl.dataset.my = e.clientY;
  });
}

export function updateLabels() {
  if (!cameraRef || !planetsRef.length) return;

  raycaster.setFromCamera(mouse, cameraRef);
  const intersects = raycaster.intersectObjects(planetsRef.map(p => p.mesh));

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    const planet = planetsRef.find(p => p.mesh === intersected);

    labelEl.textContent = planet.name;
    labelEl.style.left = `${labelEl.dataset.mx}px`;
    labelEl.style.top = `${labelEl.dataset.my}px`;
    labelEl.style.display = 'block';
  } else {
    labelEl.style.display = 'none';
  }
}
