const initialReserve = () => ({
  customer: {
    name: '',
    num: 0
  },
  id: 0,
  time: '1:00',
  stay: 0,
  status: '',
  table: ''
});

new Vue({
  el: '#app',
  data() {
    return {
      isShown: false,
      selectedReserve: initialReserve(),
      selected: {},
      times: [...new Array(24)].map((e, i) => {
        return `${i} : 00`
      }),
      tables: [{
        name: 'table1', id: '0001'
      },{
        name: 'table2', id: '0002'
      },{
        name: 'table3', id: '0003'
      },{
        name: 'table4', id: '0004'
      },{
        name: 'table5', id: '0005'
      },{
        name: 'table6', id: '0006'
      },{
        name: 'table7', id: '0007'
      },{
        name: 'table9', id: '0008'
      },{
        name: 'table10', id: '0009'
      },{
        name: 'table11', id: '0010'
      },{
        name: 'table12', id: '0012'
      }],
      reserves: [{
        customer: {
          name: 'huga',
          num: 5
        },
        id: 1,
        time: '1:00',
        stay: 2,
        status: 'arrived',
        table: '0002'
      },{
        customer: {
          name: 'fuga',
          num: 1
        },
        id: 2,
        time: '2:00',
        stay: 1,
        status: 'reserved',
        table: '0005'
      },{
        customer: {
          name: 'piyo',
          num: 1
        },
        id: 3,
        time: '2:00',
        stay: 3,
        status: 'exit',
        table: '0003'
      },{
        customer: {
          name: 'fooo',
          num: 2
        },
        id: 4,
        time: '4:00',
        stay: 2,
        status: 'reserved',
        table: '0004'
      },{
        customer: {
          name: 'bar',
          num: 4
        },
        id: 5,
        time: '0:00',
        stay: 2,
        status: 'arrived',
        table: '0004'
      },{
        customer: {
          name: 'かめぽん',
          num: 2
        },
        id: 6,
        time: '0:00',
        stay: 2,
        status: 'exit',
        table: '0007'
      }]
    }
  },
  computed: {
    selectedReserveId() {
      return this.selectedReserve.id || '';
    }
  },
  mounted() {
    this.setEventListener();
  },
  methods: {
    console(e) {
      const { x, y, offsetX, offsetY, clientX, clientY } = e;
      console.log('x: ' + x, 'y: ' + y, 'offsetX: ' + offsetX, 'offsetY: ' + offsetY, 'clientX: ' + clientX, 'clientY: ' + clientY);
    },
    onDrag(e) {
      if(!(e.x || e.y || e.screenX || e.screenY || e.clientX || e.clientX)) return;
      // console.log(e);

      const currentLeft = `${e.x + e.offsetX * 2}px`;
      const currentTop = `${e.y + e.offsetY * 2}px`;
      // const currentLeft = `${e.x + e.offsetX}px`;
      // const currentTop = `${e.y + e.offsetY}px`;
      this.console(e);
      e.target.style.top = currentTop;
      e.target.style.left = currentLeft;
      e.target.style.opacity = 1;
    },
    onDragStart(e) {
      console.log('start');
      this.selected.x = e.offsetX;
      this.selected.y = e.offsetY;
      e.target.style.opacity = 0;
    },
    onDragEnd(e) {
      console.log('end');
      e.target.style.opacity = 1;
    },
    setEventListener() {
      const $headerView = this.$refs['header-view'];
      const $ScheduleContainer = this.$refs['schedule-container'];
      $ScheduleContainer.addEventListener('scroll', e => {
        $headerView.scrollLeft = e.target.scrollLeft;
      });
      $headerView.addEventListener('scroll', e => {
        $ScheduleContainer.scrollLeft = e.target.scrollLeft;
      })
    },
    setClassNameBy(status) {
      const classList = {
        "arrived": "is-arrived",
        "reserved": "is-reserved",
        "exit": "is-exit"
      };
      return classList[status];
    },
    locateBy({time, stay, table}) {
      if  (!time || !stay || !table) return '';
      const width = stay * 136;
      const left = Number(time.split(':')[0]) * 136;
      const top = (Number(table.slice(-2)) - 1) * 64;
      return `top: ${top}px; left: ${left}px; width: ${width}px;`
    },
    // locateBySelectedReserve() {
    //   const { offsetWidth: width, offsetHeight: height, offsetLeft: left } = this.$refs.modal;
    //   const width = 200;
    //   const height = 396;
    //   const left = 0;
    //   return `position: fixed; z-index: 110; top: ${top}px; left: ${left}px; width: ${width}px;`
    // },
    showModal() {
      this.isShown = true;
    },
    closeModal() {
      this.selectedReserve = initialReserve();
      this.isShown = false;
    },
    onClickReserve(reserve) {
      this.setReserve(reserve);
      this.showModal();
    },
    setReserve(reserve) {
      this.selectedReserve = reserve;
    }
  }
})
