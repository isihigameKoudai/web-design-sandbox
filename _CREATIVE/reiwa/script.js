new Vue({
  el: '#app',
  data() {
    return {
      title: 'hello'
    }
  },
  mounted() {
    this.setEventListener();
    this.setParallax();
  },
  methods: {
    setEventListener() {
      window.addEventListener('wheel', this.scroller, false);
      window.addEventListener('load', this.scroller, false);
    },
    scroller(e) {
      const appearUps = document.querySelectorAll('.jsc-show');
      const height = window.innerHeight - 100;
      appearUps.forEach((v) => {
        const top = v.getBoundingClientRect().top;
        if ( height > top ) {
          v.classList.remove('hide');
        }
      });
    },
    setParallax() {
      const $back = document.querySelector('.jsc-back');
      window.addEventListener('wheel', () => {
        $back.style.backgroundPositionY = `${$back.getBoundingClientRect().top / 3 - 130}px`;
      });
    }
  }
})
