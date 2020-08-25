new Vue({
  el: '#app',
  data() {
    return {
      isOpen: false,
      menus: [{label: 'TOP'},{label: 'ABOUT'},{label: 'MENU'},{label: 'CONTACT'}]
    }
  },
  methods: {
    onClick() {
      this.isOpen = !this.isOpen;
    }
  }
})
