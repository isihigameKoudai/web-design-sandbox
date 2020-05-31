new Vue({
  el: '#app',
  data() {
    return {
      isOpen: false,
      imgList: [{
        path: './img/img1.JPG', alt: '', isShow: false
      },{
        path: './img/img2.JPG', alt: '', isShow: false
      },{
        path: './img/img3.JPG', alt: '', isShow: false
      },{
        path: './img/img4.JPG', alt: '', isShow: false
      },{
        path: './img/img5.JPG', alt: '', isShow: false
      },{
        path: './img/img6.JPG', alt: '', isShow: false
      }]
    }
  },
  mounted(){
    this.setIntersectionObserver('.js-reveal')
  },
  methods: {
    toggleBtn() {
      this.isOpen = !this.isOpen;
    },
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
    }
  }
})
