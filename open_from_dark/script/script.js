
new Vue({
  el: '#app',
  data() {
    return {
      isHidden: false,
      isWide: false,
      isOpen: false
    }
  },
  methods: {
    buttonPush() {
      this.isHidden = true;
      setTimeout(() => {
        this.isWide = true;
      }, 1300);
      setTimeout(() => {
        this.isOpen = true;
      }, 2000);
    }
  }
})
