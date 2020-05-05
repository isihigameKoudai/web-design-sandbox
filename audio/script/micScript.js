import MicVisualizer from './MicVisualizer.js'

const visualizer = new MicVisualizer();

const clickElem = document.createElement('div');
clickElem.textContent = 'Click to Start';
document.body.appendChild(clickElem);

let clicked = false;
clickElem.addEventListener('click', async () => {
  if (clicked) return;
  clicked = true;
  clickElem.remove();
  visualizer.play();
});
