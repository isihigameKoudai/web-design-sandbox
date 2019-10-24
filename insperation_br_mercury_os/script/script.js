new Vue({
  el: "#app",
  data() {
    return {
      isFocus: true,
      menus: [{
        label: 'App', path: 'app'
      },{
        label: 'Notification', path: 'notification'
      },{
        label: 'Todo', path: 'todo'
      },{
        label: 'Memo', path: 'memo'
      },{
        label: 'Reminder', path: 'reminder'
      },{
        label: 'Photo', path: 'photo'
      }]
    }
  },
  mounted() {
    this.setEventListener();
  },
  methods: {
    ableFocus() {
      this.isFocus = true;
    },
    disableFocus() {
      this.isFocus = false;
    },
    setEventListener() {
      const $input = document.querySelector('.search-box__text');
      $input.addEventListener('focus', () => {
        this.ableFocus();
      })

      $input.addEventListener('blur', () => {
        this.disableFocus();
      })
    }
  }
})
