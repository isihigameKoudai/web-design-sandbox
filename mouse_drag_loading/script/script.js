let $interval = null;

new Vue ({
  el: '#app',
  data() {
    return {
      count: 0,
      cWidth: 8, //カーソルの大きさ
      fWidth: 40, //フォロワーの大きさ
      delay: 10, //数字を大きくするとフォロワーがより遅れて来る
      mouseX: 0, //マウスのX座標
      mouseY: 0, //マウスのY座標
      posX: 0, //フォロワーのX座標
      posY: 0, //フォロワーのX座標,
      isPush: false
    }
  },
  methods: {
    setCount( n = 0 ) {
      this.count += n;
      if (this.count === 100) {
        this.count = 0;
      }
    },
    setEventListener() {
      // const $follower = document.querySelector('.js-follower');

      window.addEventListener('mousemove', e => {
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
      });

      window.addEventListener('mousedown', e => {
        this.isPush = true;

        $interval = setInterval(() => {
          this.setCount(1)
        }, 20);
        this.fWidth = 80;
        TweenMax.to(this.$refs.follower, 0.3, { width: this.fWidth, height: this.fWidth});
      });

      window.addEventListener('mouseup', () => {
        this.isPush = false;
        this.fWidth = 40;
        TweenMax.to(this.$refs.follower, 0.3, { width: this.fWidth, height: this.fWidth });
        clearInterval($interval);
      });
    },
    setTweenMax() {
      TweenMax.to({}, .0001, {
        repeat: -1,
        onRepeat: () => {
          this.posX += (this.mouseX - this.posX) / this.delay;
          this.posY += (this.mouseY - this.posY) / this.delay;

          TweenMax.set(this.$refs.cursor, {
            css: {
              left: this.mouseX - (this.cWidth / 2),
              top: this.mouseY - (this.cWidth / 2)
            }
          });

          TweenMax.set(this.$refs.follower, {
            css: {
              left: this.posX - (this.fWidth / 2) + this.cWidth,
              top: this.posY - (this.fWidth / 2) + this.cWidth
            }
          });
        }
      });
    }
  },
  mounted() {
    this.setEventListener();
    this.setTweenMax();
  }
});
