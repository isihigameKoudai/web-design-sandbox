// web audio api 1
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

const url = '/audio/audio/Adventure.mp3';

let audioSource = null;
let playCtx = null;

const c = document.getElementById('canvas');
c.width = window.innerWidth;
c.height = window.innerHeight;
const cw = window.innerWidth;
const ch = window.innerHeight

const canvasCtx = c.getContext('2d');

const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
document.addEventListener(eventName, () => {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload =  () => {
    ctx.decodeAudioData(request.response, (audioBuffer) => {
      if(audioSource) {
        audioSource.disconnect();
        playCtx.close();
      }

      playCtx = new AudioContext();
      audioSource = playCtx.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(playCtx.destination);
      audioSource.start();

      // Visualizerを起動
      createVisualizer(audioBuffer);
    });
  }
  request.send();
});

/**
 * ビジュアライザー
 */
const Visualizer = function(buffer) {
  this.sourceNode = ctx.createBufferSource();  // AudioBufferSourceNodeを作成
  this.sourceNode.buffer = buffer;                  // 取得した音声データ(バッファ)を音源に設定
  this.analyserNode = ctx.createAnalyser();    // AnalyserNodeを作成
  this.times = new Uint8Array(this.analyserNode.frequencyBinCount);  // 時間領域の波形データを格納する配列を生成
  this.sourceNode.connect(this.analyserNode);       // AudioBufferSourceNodeをAnalyserNodeに接続
  this.analyserNode.connect(ctx.destination);  // AnalyserNodeをAudioDestinationNodeに接続
  this.sourceNode.start(0);                         // 再生開始
  this.draw();                                      // 描画開始
};

const createVisualizer = function(buffer) {
  const visualizer = new Visualizer(buffer);
}

Visualizer.prototype.draw = function() {
  // 0~1まで設定でき、0に近いほど描画の更新がスムーズになり, 1に近いほど描画の更新が鈍くなる。
  this.analyserNode.smoothingTimeConstant = 0.5;
  // FFTサイズを指定する。デフォルトは2048。
  this.analyserNode.fftSize = 2048;
  // 時間領域の波形データを引数の配列に格納するメソッド。
  // analyserNode.fftSize / 2の要素がthis.timesに格納される。今回の配列の要素数は1024。
  this.analyserNode.getByteTimeDomainData(this.times);

  // 全ての波形データを描画するために、一つの波形データのwidthを算出する。
  const barWidth = cw / this.analyserNode.frequencyBinCount;

  canvasCtx.fillStyle = 'rgba(0, 0, 0, 1)';
  canvasCtx.fillRect(0, 0, cw, ch);

  // analyserNode.frequencyBinCountはanalyserNode.fftSize / 2の数値。よって今回は1024。
  for (var i = 0; i < this.analyserNode.frequencyBinCount; ++i) {
    var value = this.times[i]; // 波形データ 0 ~ 255までの数値が格納されている。
    var percent = value / 255; // 255が最大値なので波形データの%が算出できる。
    var height = ch * percent; // %に基づく高さを算出
    var offset = ch - height;  // y座標の描画開始位置を算出

    canvasCtx.fillStyle = '#fff';
    canvasCtx.fillRect(i * barWidth, offset, barWidth, 2);
  }

  window.requestAnimationFrame(this.draw.bind(this));
};

// requestAnimationFrame を他端末でも動作可能にする
const setRequestAnimationFrame = () => {
  const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
}

setRequestAnimationFrame();
