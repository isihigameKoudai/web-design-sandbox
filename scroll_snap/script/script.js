new Vue({
  el: '#app',
  data() {
    return {
      isOpen: false,
      count: 0,
      menus: ['Red', 'Yellow', 'Green', 'Blue']
    }
  },
  methods: {
    moveNext() {
      this.count++;
      if (this.count === this.menus.length - 1) this.count = 0;
    },
    movePrev() {
      if (this.count === 0) {
        this.count = this.menus.length - 1;
        return;
      }

      this.count--;
    }
  },
  computed: {
    currentIs() {
      return this.menus[this.count % this.menus.length];
    }
  }
})

