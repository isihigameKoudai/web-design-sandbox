
new Vue({
  el: '#app',
  data() {
    return {
      isHidden: false
    }
  },
  methods: {
    buttonPush() {
      this.isHidden = true;
    }
  }
})
