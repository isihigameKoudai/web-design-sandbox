import AudioVisualizer from './AudioVisualizer.js'

const audioInstance = new AudioVisualizer();

const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(eventName, () => {
  audioInstance.play('/audio/audio/Adventure.mp3');
})
