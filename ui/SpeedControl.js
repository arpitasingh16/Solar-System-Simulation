export const orbitSpeeds = {};

export function setupSpeedControls(planetData) {
  // Toggle Button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Show Controls';
  toggleBtn.style.position = 'absolute';
  toggleBtn.style.top = '10px';
  toggleBtn.style.right = '10px';
  toggleBtn.style.padding = '6px 12px';
  toggleBtn.style.zIndex = 100;
  toggleBtn.style.fontSize = '14px';
  document.body.appendChild(toggleBtn);

  // Sliders Panel
  const container = document.createElement('div');
  container.id = 'controls';
  container.style = `
    display: none;
    position: absolute;
    top: 50px;
    left: 10px;
    background: rgba(0,0,0,0.6);
    padding: 10px;
    border-radius: 8px;
    color: white;
    font-family: sans-serif;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 99;
  `;
  document.body.appendChild(container);

  toggleBtn.onclick = () => {
    const isVisible = container.style.display === 'block';
    container.style.display = isVisible ? 'none' : 'block';
    toggleBtn.textContent = isVisible ? 'Show Controls' : 'Hide Controls';
  };

  // Sliders for each planet
  planetData.forEach(({ name, orbitSpeed }) => {
    orbitSpeeds[name] = orbitSpeed;

    const wrapper = document.createElement('div');
    wrapper.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.textContent = `${name} Speed`;
    label.style.display = 'block';

    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 5;
    input.step = 0.01;
    input.value = orbitSpeed;
    input.style.width = '150px';

    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = ` ${orbitSpeed}`;

    input.addEventListener('input', () => {
      orbitSpeeds[name] = parseFloat(input.value);
      valueDisplay.textContent = ` ${input.value}`;
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(valueDisplay);
    container.appendChild(wrapper);
  });
}
