const vm = new Vue({
  el: '#app',
  data() {
    return {
      color1: '#ff0000',
      color2: '#00ff00',
      color3: '#0000ff',
      selected: { value: 'normal' },
      blendModeList: [
        { value: 'normal' },
        { value: 'multiply' },
        { value: 'screen' },
        { value: 'overlay' },
        { value: 'darken' },
        { value: 'lighten' },
        { value: 'color-dodge' },
        { value: 'color-burn' },
        { value: 'hard-light' },
        { value: 'soft-light' },
        { value: 'difference' },
        { value: 'exclusion' },
        { value: 'hue' },
        { value: 'saturation' },
        { value: 'color' },
        { value: 'luminosity' }
      ]
    }
  },
  computed: {
   blendStyleName() {
     return `mix-blend-mode: ${this.selected};`;
   }
  },
  methods: {
    inputColor(type, color) {
      this[type] = color.srcElement.value;
    }
  }
})
