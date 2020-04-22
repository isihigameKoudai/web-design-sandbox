class Audio {
  constructor(url = '') {
    this.url = url;
    this.init();
  }

  init() {
    // const AudioContext = window.AudioContext || window.webkitAudioContext;
    // const ctx = new AudioContext();
    this.audio = null;
    this.playContext = null;
    console.log('init');

  }
}

const player = new Audio();

console.log(player);
