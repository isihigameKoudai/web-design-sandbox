/**
 * 音声を取り扱うクラス
 * バッファーの管理や音声の再生を司る
 */
class AudioVisualizer {
  constructor() {
    // Web Audio apiの設定
    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new this.AudioContext();
    this.url = null;
    this.playContext = null;
    this.audioSorce = null;
  }

  /**
   * 音声の再生
   * @param {String} url オーディオのリソース場所
   */
  play(url) {
    const request = new XMLHttpRequest();
    this.url = url;

    return new Promise((resolve) => {
      request.open('GET', this.url, true);
      request.responseType = 'arraybuffer';
      request.onload =  () => {
        this.ctx.decodeAudioData(request.response, (audioBuffer) => {

          if(this.audioSource) {
            this.audioSource.disconnect();
            this.playContext.close();
          }

          this.playContext = new this.AudioContext();
          this.audioSource = this.playContext.createBufferSource();
          this.audioSource.buffer = audioBuffer;
          this.audioSource.connect(this.playContext.destination);
          this.audioSource.start();

          // Visualizerを起動
          this.setVisualizer(audioBuffer)
          resolve();
        });
      }

      request.send();
    });
  }
  /**
   *
   * @param {*} audioBuffer Web audio apiのdecodeAudioDataによるaudioBuffer
   */
  setVisualizer(audioBuffer) {
    // Visualizerの設定
    this.sourceNode = this.ctx.createBufferSource();  // AudioBufferSourceNodeを作成
    this.sourceNode.buffer = audioBuffer;             // 取得した音声データ(バッファ)を音源に設定
    this.analyserNode = this.ctx.createAnalyser();    // AnalyserNodeを作成
    this.times = new Uint8Array(this.analyserNode.frequencyBinCount);  // 時間領域の波形データを格納する配列を生成
    this.sourceNode.connect(this.analyserNode);       // AudioBufferSourceNodeをAnalyserNodeに接続
    this.analyserNode.connect(this.ctx.destination);  // AnalyserNodeをAudioDestinationNodeに接続
    this.sourceNode.start(0);                         // 再生開始

    // requestAnimationFrameの各ブラウザ対応
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    this.draw({ target: '#canvas', smoothingTimeConstant: 0.5, fftSize: 2048 });
  }

  /**
   *
   * @param {object} option ビジュアライズする時に必要なオプション
   * @param {string} option.target ビジュアライズのターゲットDOM指定
   * @param {number} option.smoothingTimeConstant 0~1まで設定でき、0に近いほど描画の更新がスムーズになり, 1に近いほど描画の更新が鈍くなる。
   * @param {number}  option.fftSize FFTサイズを指定する。デフォルトは2048。
   */
  draw({
    target = '#canvas',
    smoothingTimeConstant = 0.5,
    fftSize = 2048
  }) {

    // ビジュアライザーのターゲットとなるDOMの設定をする
    const canvas = document.querySelector(target)
    const canvasCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cw = window.innerWidth;
    const ch = window.innerHeight

    this.analyserNode.smoothingTimeConstant = smoothingTimeConstant;
    this.analyserNode.fftSize = fftSize;
    // 時間領域の波形データを引数の配列に格納するメソッド。
    // analyserNode.fftSize / 2の要素がthis.timesに格納される。今回の配列の要素数は1024。
    this.analyserNode.getByteTimeDomainData(this.times);

    // 全ての波形データを描画するために、一つの波形データのwidthを算出する。
    const barWidth = cw / this.analyserNode.frequencyBinCount;

    canvasCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    canvasCtx.fillRect(0, 0, cw, ch);

    // analyserNode.frequencyBinCountはanalyserNode.fftSize / 2の数値。よって今回は1024。
    for (let i = 0; i < this.analyserNode.frequencyBinCount; ++i) {
      const value = this.times[i]; // 波形データ 0 ~ 255までの数値が格納されている。
      const percent = value / 255; // 255が最大値なので波形データの%が算出できる。
      const height = ch * percent; // %に基づく高さを算出
      const offset = ch - height;  // y座標の描画開始位置を算出

      canvasCtx.fillStyle = '#fff';
      canvasCtx.fillRect(i * barWidth, offset, barWidth, 2);
    }

    window.requestAnimationFrame(this.draw.bind(this));
  }
}

export default AudioVisualizer;
