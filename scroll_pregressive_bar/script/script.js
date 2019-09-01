
new Vue({
  el: "#app",
  data() {
    return {
      progress: 0
    }
  },
  computed: {
    styleWidth() {
      return `transform: scaleX(${Math.floor(this.progress * 100) / 50})`;
    }
  },
  mounted() {
    const h = Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] );
    const windowHeight = window.innerHeight;
    const allHeight = h - windowHeight;
    window.addEventListener("scroll", e => {
      this.progress = window.pageYOffset / allHeight;
    });
  }
})
