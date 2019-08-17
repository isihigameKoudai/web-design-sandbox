
new Vue({
  el: '#app',
  data() {
    return {
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
        time: '1:00',
        stay: 2,
        status: 'arrived',
        table: '0002'
      },{
        customer: {
          name: 'fuga',
          num: 1
        },
        time: '2:00',
        stay: 1,
        status: 'reserved',
        table: '0005'
      },{
        customer: {
          name: 'piyo',
          num: 1
        },
        time: '2:00',
        stay: 3,
        status: 'exit',
        table: '0003'
      },{
        customer: {
          name: 'fooo',
          num: 2
        },
        time: '4:00',
        stay: 2,
        status: 'reserved',
        table: '0004'
      },{
        customer: {
          name: 'bar',
          num: 4
        },
        time: '0:00',
        stay: 2,
        status: 'arrived',
        table: '0004'
      },{
        customer: {
          name: 'かめぽん',
          num: 2
        },
        time: '0:00',
        stay: 2,
        status: 'exit',
        table: '0007'
      }]
    }
  },
  mounted() {
    this.setEventListener();
  },
  methods: {
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
    rocateBy({time, stay, table}) {
      const width = stay * 136;
      const left = Number(time.split(':')[0]) * 136;
      const top = (Number(table.slice(-2)) - 1) * 64;
      return `top: ${top}px; left: ${left}px; width: ${width}px;`
    }
  }
})
