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
    setTweenMax() {
      TweenMax.to({}, .0001, {
        repeat: -1,
        onRepeat: () => {

          this.posX += (this.mouseX - this.posX) / this.delay;
          this.posY += (this.mouseY - this.posY) / this.delay;

          const { x, y, w, h, center, halfW, halfH} = this.hovered;

          const r = this.getRootByDuringPoint({x1: center.x, y1: center.y}, {x2: this.mouseX, y2: this.mouseY});
          const diffX = r.x / halfW * this.addSize;
          const diffY = r.y / halfH * this.addSize;
          const followerX = this.isHover ? x - (this.addSize / 2) + diffX / 2 : this.posX - (this.fWidth / 2);
          const followerY = this.isHover ? y - (this.addSize / 2) + diffY / 2 : this.posY - (this.fWidth / 2);


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

      if (!target.getBoundingClientRect()) return {};

      const targetX = target.getBoundingClientRect().left + window.pageXOffset;
      const targetY = target.getBoundingClientRect().top + window.pageYOffset;
      const targetW = target.clientWidth;
      const targetH = target.clientHeight;

      return {
        x: targetX,
        y: targetY,
        w: targetW,
        h: targetH,
        halfW: targetW / 2,
        halfH: targetH / 2,
        center: {
          x: targetX + targetW / 2,
          y: targetY + targetH / 2,
        }
      }
    },
    getRootByDuringPoint(absolute = {x1: 0, y1: 0}, relative = {x2: 0, y2: 0}) {
      const { x1, y1 } = absolute;
      const { x2, y2 } = relative;
      const squareX = (x2 - x1) * (x2 - x1);
      const squareY = (y2 - y1) * (y2 - y1);

      return {
        sqrt: Math.round(Math.sqrt(squareX + squareY)),
        x: x2 - x1,
        y: y2 - y1
      };
    }
  },
  mounted() {
    this.setEventListener();
    this.setTweenMax();
  }
});
