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
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.AudioContext = new AudioContext();
    this.stream = null;
    this.input = null;
    this.analyser = null;

    this.$canvas = null;
    this.$gl = null;
    this.requestId = null;
    this.uniformLocs = {};

    this.visualizerOption = {
      timeDomainArray: new Float32Array(),
      frequencyArray: new Float32Array(),
      timeDomainVbo: null,
      frequencyVbo: null
    }
    console.log(this.visualizerOption);
    // this.init();
  }

  async init() {
    this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.input = this.AudioContext.createMediaStreamSource(this.stream);
    this.analyser = this.AudioContext.createAnalyser();
    this.input.connect(this.analyser);
  }

  /**
   *
   * @param {object} option ビジュアライズする時に必要なオプション
   * @param {string} option.target ビジュアライズのターゲットDOM指定
   */
  draw({ target = '#canvas'}) {
    this.$canvas = document.querySelector(target);
    this.$canvas.width = window.innerWidth;
    this.$canvas.height = window.innerHeight;

    this.$gl = this.$canvas.getContext('webgl2');
    this.$gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.program = createProgram(this.$gl,
      createShader(this.$gl, renderLineVertex, this.$gl.VERTEX_SHADER),
      createShader(this.$gl, renderLineFragment, this.$gl.FRAGMENT_SHADER)
    );
    this.uniformLocs = getUniformLocs(this.$gl, this.program, ['u_length', 'u_minValue', 'u_maxValue', 'u_color']);

    this.visualizerOption.timeDomainArray = new Float32Array(this.analyser.fftSize);
    this.visualizerOption.frequencyArray = new Float32Array(this.analyser.frequencyBinCount);
    this.visualizerOption.timeDomainVbo = createVbo(this.$gl, this.visualizerOption.timeDomainArray, this.$gl.DYNAMIC_DRAW);
    this.visualizerOption.frequencyVbo = createVbo(this.$gl, this.visualizerOption.frequencyArray, this.$gl.DYNAMIC_DRAW);
  }

  /**
   *
   */
  render() {
    this.$gl.clear(this.$gl.COLOR_BUFFER_BIT);

    this.analyser.getFloatTimeDomainData(this.visualizerOption.timeDomainArray);
    this.$gl.bindBuffer(this.$gl.ARRAY_BUFFER, this.visualizerOption.timeDomainVbo);
    this.$gl.bufferSubData(this.$gl.ARRAY_BUFFER, 0, this.visualizerOption.timeDomainArray);

    this.$gl.useProgram(this.program);
    this.$gl.uniform1f(this.uniformLocs.get('u_length'), this.visualizerOption.timeDomainArray.length);
    this.$gl.uniform1f(this.uniformLocs.get('u_minValue'), -1.0);
    this.$gl.uniform1f(this.uniformLocs.get('u_maxValue'), 1.0);
    this.$gl.uniform3f(this.uniformLocs.get('u_color'), 1.0, 0.0, 0.0);
    this.$gl.bindBuffer(this.$gl.ARRAY_BUFFER, this.visualizerOption.timeDomainVbo);
    this.$gl.enableVertexAttribArray(0);
    this.$gl.vertexAttribPointer(0, 1, this.$gl.FLOAT, false, 0, 0);
    this.$gl.drawArrays(this.$gl.LINE_STRIP, 0, this.visualizerOption.timeDomainArray.length);

    this.analyser.getFloatFrequencyData(this.visualizerOption.frequencyArray);
    this.$gl.bindBuffer(this.$gl.ARRAY_BUFFER, this.visualizerOption.frequencyVbo);
    this.$gl.bufferSubData(this.$gl.ARRAY_BUFFER, 0, this.visualizerOption.frequencyArray);

    this.$gl.uniform1f(this.uniformLocs.get('u_length'), this.visualizerOption.frequencyArray.length);
    this.$gl.uniform1f(this.uniformLocs.get('u_minValue'), this.analyser.minDecibels);
    this.$gl.uniform1f(this.uniformLocs.get('u_maxValue'), this.analyser.maxDecibels);
    this.$gl.uniform3f(this.uniformLocs.get('u_color'), 0.0, 0.0, 1.0);
    this.$gl.bindBuffer(this.$gl.ARRAY_BUFFER, this.visualizerOption.frequencyVbo);
    this.$gl.enableVertexAttribArray(0);
    this.$gl.vertexAttribPointer(0, 1, this.$gl.FLOAT, false, 0, 0);
    this.$gl.drawArrays(this.$gl.LINE_STRIP, 0, this.visualizerOption.frequencyArray.length);

    this.requestId = requestAnimationFrame(this.render);
  }

  resize() {
    if (this.requestId != null) {
      cancelAnimationFrame(this.requestId);
    }
    this.$canvas.width = window.innerWidth;
    this.$canvas.height = window.innerHeight;
    this.$gl.viewport(0.0, 0.0, this.$canvas.width, this.$canvas.height);
    this.requestId = requestAnimationFrame(this.render);
  }
}

export default MicVisualizer;
