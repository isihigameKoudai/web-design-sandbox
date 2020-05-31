////////////////////////////////////////////
// Shader
////////////////////////////////////////////
const renderLineVertex = `#version 300 es
precision highp float;
layout (location = 0) in float i_value;
uniform float u_length;
uniform float u_minValue;
uniform float u_maxValue;
#define linearstep(edge0, edge1, x) max(min((x - edge0) / (edge1 - edge0), 1.0), 0.0)
void main(void) {
  gl_Position = vec4(
    (float(gl_VertexID) / u_length) * 2.0 - 1.0,
    linearstep(u_minValue, u_maxValue, i_value) * 2.0 - 1.0,
    0.0,
    1.0
  );
}
`;

const renderLineFragment = `#version 300 es
precision highp float;
out vec4 o_color;
uniform vec3 u_color;
void main(void) {
  o_color = vec4(u_color, 1.0);
}
`;

// シェーダーのソースコードをWebGLに適用させる
const createShader = function(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) + source);
  }

  return shader;
}

const createProgram = function(gl, vertShader, fragShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

const getUniformLocs = function(gl, program, names) {
  const map = new Map();
  names.forEach((name) => map.set(name, gl.getUniformLocation(program, name)));
  return map;
}

const createVbo = function(gl, array, usage) {
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, array, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
}

////////////////////////////////////////////
// MicVisualizer Class
////////////////////////////////////////////
class MicVisualizer {
  constructor() {
    this.$gl = null;
    this.$canvas = null;
    this.analyzer = null;
    this.program = null;
    this.input = null;
    this.uniformLocs = null;
    this.timeDomainArray = null;
    this.frequencyArray = null;
    this.timeDomainVbo = null;
    this.frequencyVbo = null;
    this.requestId = null;

    this.colors = {
      vert: {
        r: 0.0,
        g: 0.5,
        b: 1.0
      },
      center: {
        r: 1.0,
        g: 0.5,
        b: 0.0
      }
    }

    // requestAnimationFrameの各ブラウザ対応
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  }

  /**
   * @param {String?} target canvasのターゲット
   */
  async createInitialContext(target = '#canvas') {
    // AudioContextの作成
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    // getUserMediaでマイクを有効化、マイクオーディオをソースとして登録
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    const input  = audioCtx.createMediaStreamSource(stream);
    // AnalyserNode（音声の時間と周波数を解析、音声の可視化に使用）の生成
    const analyzer = audioCtx.createAnalyser();

    // 表示用canvasの設定
    const canvas = document.querySelector(target);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // webglを有効化と画面初期化
    const gl = canvas.getContext('webgl2');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const program = createProgram(gl,
      createShader(gl, renderLineVertex, gl.VERTEX_SHADER),
      createShader(gl, renderLineFragment, gl.FRAGMENT_SHADER)
    );

    // シェーダー側の変数に送る情報の設定をする
    const uniformLocs = getUniformLocs(gl, program, ['u_length', 'u_minValue', 'u_maxValue', 'u_color']);

    const timeDomainArray = new Float32Array(analyzer.fftSize);
    const frequencyArray = new Float32Array(analyzer.frequencyBinCount);
    const timeDomainVbo = createVbo(gl, timeDomainArray, gl.DYNAMIC_DRAW);
    const frequencyVbo = createVbo(gl, frequencyArray, gl.DYNAMIC_DRAW);

    return {
      audioCtx,
      stream,
      input,
      analyzer,
      canvas,
      gl,
      program,
      uniformLocs,
      timeDomainArray,
      frequencyArray,
      timeDomainVbo,
      frequencyVbo
    }
  }

  /**
   * マイクをONにする
   */
  async play() {
    const {
      input,
      analyzer,
      gl,
      canvas,
      program,
      uniformLocs,
      timeDomainArray,
      frequencyArray,
      timeDomainVbo,
      frequencyVbo
    } = await this.createInitialContext();

    this.$gl = gl;
    this.$canvas = canvas;
    this.analyzer = analyzer;
    this.program = program;
    this.input = input;
    this.uniformLocs = uniformLocs;
    this.timeDomainArray = timeDomainArray;
    this.frequencyArray = frequencyArray;
    this.timeDomainVbo = timeDomainVbo;
    this.frequencyVbo = frequencyVbo;

    input.connect(analyzer);

    this.requestId = window.requestAnimationFrame(this.render.bind(this));
  }

  /**
   * 指定されたシェーダーを画面に描画する
   */
  render() {
    const {
      analyzer,
      $gl,
      program,
      uniformLocs,
      timeDomainArray,
      frequencyArray,
      timeDomainVbo,
      frequencyVbo
    } = this;

    $gl.clear($gl.COLOR_BUFFER_BIT);

    analyzer.getFloatTimeDomainData(timeDomainArray);
    $gl.bindBuffer($gl.ARRAY_BUFFER, timeDomainVbo);
    $gl.bufferSubData($gl.ARRAY_BUFFER, 0, timeDomainArray);

    $gl.useProgram(program);
    $gl.uniform1f(uniformLocs.get('u_length'), timeDomainArray.length);
    $gl.uniform1f(uniformLocs.get('u_minValue'), -1.0);
    $gl.uniform1f(uniformLocs.get('u_maxValue'), 1.0);

    this.colors.center.b = this.colors.center.b + 0.01;

    $gl.uniform3f(uniformLocs.get('u_color'), 1.0, 0.3, Math.sin(this.colors.center.b));
    $gl.bindBuffer($gl.ARRAY_BUFFER, timeDomainVbo);
    $gl.enableVertexAttribArray(0);
    $gl.vertexAttribPointer(0, 1, $gl.FLOAT, false, 0, 0);
    $gl.drawArrays($gl.LINE_STRIP, 0, timeDomainArray.length);

    analyzer.getFloatFrequencyData(frequencyArray);
    $gl.bindBuffer($gl.ARRAY_BUFFER, frequencyVbo);
    $gl.bufferSubData($gl.ARRAY_BUFFER, 0, frequencyArray);

    $gl.uniform1f(uniformLocs.get('u_length'), frequencyArray.length);
    $gl.uniform1f(uniformLocs.get('u_minValue'), analyzer.minDecibels);
    $gl.uniform1f(uniformLocs.get('u_maxValue'), analyzer.maxDecibels);

    this.colors.vert.g = this.colors.vert.g + 0.1;
    $gl.uniform3f(uniformLocs.get('u_color'), 1.0, Math.sin(this.colors.vert.g), Math.cos(this.colors.vert.b));
    $gl.bindBuffer($gl.ARRAY_BUFFER, frequencyVbo);
    $gl.enableVertexAttribArray(0);
    $gl.vertexAttribPointer(0, 1, $gl.FLOAT, false, 0, 0);
    $gl.drawArrays($gl.LINE_STRIP, 0, frequencyArray.length);

    window.requestAnimationFrame(this.render.bind(this));
  }

  /**
   * windowのサイズが変更されたときにcanvasのリサイズ処理をかける
   */
  resize() {
    this.$canvas.width = window.innerWidth;
    this.$canvas.height = window.innerHeight;
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default MicVisualizer;
