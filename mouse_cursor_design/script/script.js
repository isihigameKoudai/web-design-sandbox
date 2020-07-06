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
      posY: 0, //フォロワーのX座標
      addSize: 0,
      isHover: false,
      hoverOn: {}
    }
  },
  computed: {
    hovered() {
      return this.getRect(this.hoverOn);
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

      const $hovereds = document.querySelectorAll('.js-hovered');
      console.log($hovereds);
      [...$hovereds].map(item => {
        item.addEventListener('mouseover', e => {
          const {x,y,w,h} = this.getRect(e.target);
          this.addSize = 80;

          this.isHover = true;
          this.hoverOn = e.target;

          const css = { width: w + this.addSize, height: h + this.addSize, borderRadius: 20 };
          TweenMax.to($follower, 0.5, css);
        })

        item.addEventListener('mouseleave', e => {
          this.fWidth = 40;
          this.isHover = false;
          TweenMax.to($follower, 0.3, { width: this.fWidth, height: this.fWidth, borderRadius: '50%' });
        })
      })

    },
    setTwennMax() {
      TweenMax.to({}, .0001, {
        repeat: -1,
        onRepeat: () => {

          this.posX += (this.mouseX - this.posX) / this.delay;
          this.posY += (this.mouseY - this.posY) / this.delay;

          const { x, y, w, h} = this.hovered;
          const targetTotalX = x + w;
          const targetTotalY = y + h;
          // console.log(x, y, w, h, this.posX, this.posY);

          const followerX = this.isHover ? this.posX - ((this.addSize + w) / 2) : this.posX - (this.fWidth / 2);
          const followerY = this.isHover ? this.posY - ((this.addSize + h) / 2) : this.posY - (this.fWidth / 2);

          TweenMax.set(this.$refs.follower, {
            css: {
              left: followerX,
              top: followerY
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
    },
    getRect(target) {
      if (!target) return {};

      const targetX = target.getBoundingClientRect().left;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset;
      const targetW = target.clientWidth;
      const targetH = target.clientHeight;

      return {
        x: targetX,
        y: targetY,
        w: targetW,
        h: targetH,
        halfW: targetW / 2,
        half: targetH / 2,
        center: {
          x: targetX + targetW / 2,
          y: targetY + targetH / 2,
        }
      }
    }
  },
  mounted() {
    this.setEventListener();
    this.setTwennMax();
  }
});
