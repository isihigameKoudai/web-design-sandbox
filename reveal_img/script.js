new Vue({
  el: '#app',
  data() {
    return {
      imgLists: [{
        path: './img/sample1.jpg', alt: '', isShow: false
      },{
        path: './img/sample2.jpeg', alt: '', isShow: false
      },{
        path: './img/sample3.jpeg', alt: '', isShow: false
      },{
        path: './img/sample4.jpeg', alt: '', isShow: false
      },{
        path: './img/sample5.jpg', alt: '', isShow: false
      },{
        path: './img/sample6.jpg', alt: '', isShow: false
      }]
    }
  },
  mounted(){
    this.setIntersectionObserver('.js-reveal')
  },
  methods: {
    /**
     * IntersectionObserverの設定
     * @param {String} className DOM要素を取得する時のクラス名
     */
    setIntersectionObserver(className) {
      // Observerの設定
      const options = {
        // root: document.querySelector('#scrollArea'), // 対象要素が発火するべき到達エリア
        threshold: 1.0
      };

      const clientHeight = document.documentElement.clientHeight;
      // IntersectionPbserverが作動した時の動作を取得したDOMに適用する
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const rect = entry.target.getBoundingClientRect();
          if (clientHeight > rect.top) {
            entry.target.classList.add('show');
          }
        }
      }, options);

      // DOMを取得したのち、observerを対象のDOMに適用
      const targets = document.querySelectorAll(className);
      targets.forEach(target => observer.observe(target));
    },
    onClickScroll() {
      const top = document.querySelector('.top');
      window.scroll(top.innerHeight);
    }
  }
});
