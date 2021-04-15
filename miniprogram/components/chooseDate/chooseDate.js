// components/chooseDate/chooseDate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    today: '',
    toyear: '',
    tomonth: '',
  },
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
    this.setNowDate()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    dateSelectAction: function (e) {
      var cur_day = e.currentTarget.dataset.idx;
      var item = e.currentTarget.dataset.item;
      console.log(this.data.cur_year,this.data.cur_month,item,this.data.toyear,this.data.tomonth,this.data.today);
      this.setData({
        todayIndex: cur_day,
      })
      console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day + 1}日`);
      let data = {
        year: this.data.cur_year,
        month: this.data.cur_month,
        day: cur_day + 1
      }
      this.triggerEvent('dateSelectAction', data)     //通过triggerEvent将参数传给父组件
    },
    setNowDate: function () {
      const date = new Date();
      const cur_year = date.getFullYear();
      const cur_month = date.getMonth() + 1;
      const todayIndex = date.getDate() - 1;
      console.log(`日期：${todayIndex}`)
      const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
      this.calculateEmptyGrids(cur_year, cur_month);
      this.calculateDays(cur_year, cur_month);
      this.setData({
        cur_year: cur_year,
        toyear: cur_year,
        tomonth: cur_month,
        cur_month: cur_month,
        weeks_ch,
        todayIndex,
        today: todayIndex + 1
      })
    },

    getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    },
    getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },
    calculateEmptyGrids(year, month) {
      const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
      let empytGrids = [];
      if (firstDayOfWeek > 0) {
        for (let i = 0; i < firstDayOfWeek; i++) {
          empytGrids.push(i);
        }
        this.setData({
          hasEmptyGrid: true,
          empytGrids
        });
      } else {
        this.setData({
          hasEmptyGrid: false,
          empytGrids: []
        });
      }
    },
    calculateDays(year, month) {
      let days = [];

      const thisMonthDays = this.getThisMonthDays(year, month);

      for (let i = 1; i <= thisMonthDays; i++) {
        days.push(i);
      }

      this.setData({
        days
      });
    },
    handleCalendar(e) {
      const handle = e.currentTarget.dataset.handle;
      const cur_year = this.data.cur_year;
      const cur_month = this.data.cur_month;
      if (handle === 'prev') {
        let newMonth = cur_month - 1;
        let newYear = cur_year;
        if (newMonth < 1) {
          newYear = cur_year - 1;
          newMonth = 12;
        }

        this.calculateDays(newYear, newMonth);
        this.calculateEmptyGrids(newYear, newMonth);

        this.setData({
          cur_year: newYear,
          cur_month: newMonth,
        })

      } else {
        let newMonth = cur_month + 1;
        let newYear = cur_year;
        if (newMonth > 12) {
          newYear = cur_year + 1;
          newMonth = 1;
        }

        this.calculateDays(newYear, newMonth);
        this.calculateEmptyGrids(newYear, newMonth);

        this.setData({
          cur_year: newYear,
          cur_month: newMonth
        })
      }
    }
  }
})