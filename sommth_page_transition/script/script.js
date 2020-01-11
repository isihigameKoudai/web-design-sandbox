new Vue({
  el: '#app',
  methods: {
    onMoveTo(e, path) {
      e.preventDefault();
      document.querySelector('body').classList.add('is-move');
      setTimeout(()=> location.assign(path), 900);
    }
  }
});
