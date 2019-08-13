new Vue({
  el: '#app',
  data() {
    return {
      cWidth: 8, //カーソルの大きさ
      fWidth: 40, //フォロワーの大きさ
      delay: 10, //数字を大きくするとフォロワーがより遅れて来る
      mouseX: 0, //マウスのX座標
      mouseY: 0, //マウスのY座標
      posX: 0, //フォロワーのX座標
      posY: 0 //フォロワーのX座標
    }
  },
  methods: {
    setEventListener() {
      window.addEventListener('mousemove', e => {
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
      });

      // リンクのアクティブ化
      const $link = this.$refs.link;
      const $follower = this.$refs.follower;

      $link.addEventListener('mouseenter', () => {
        this.fWidth = 70;
        TweenMax.to($follower, 0.3, { width: this.fWidth, height: this.fWidth });
      });
      // リンクの非ホバー時の対応
      $link.addEventListener('mouseleave', () => {
        this.fWidth = 40;
        TweenMax.to($follower, 0.3, { width: this.fWidth, height: this.fWidth });
      });
    },
    setTwennMax() {
      TweenMax.to({}, .0001, {
        repeat: -1,
        onRepeat: () => {
          this.posX += (this.mouseX - this.posX) / this.delay;
          this.posY += (this.mouseY - this.posY) / this.delay;

          TweenMax.set(this.$refs.follower, {
            css: {
              left: this.posX - (this.fWidth / 2),
              top: this.posY - (this.fWidth / 2)
            }
          });

          TweenMax.set(this.$refs.cursor, {
            css: {
              left: this.mouseX - (this.cWidth / 2),
              top: this.mouseY - (this.cWidth / 2)
            }
          });
        }
      });
    }
  },
  mounted() {
    this.setEventListener();
    this.setTwennMax();
  }
});
