/**
 * Author: Meng
 * Date: 2022-07-13
 * Desc: 日期选择
 */
import Dates from '../../utils/date/index';

function _formatNumber(num) {
  return (num > 9 ? '' : '0') + num;
}

Component({
  properties: {
    mode: {
      type: String,
      value: '0', // 0无限制1昨天今天明天
    },
  },

  data: {
    touchmove: true,
    years: [],
    months: [],
    days: [],
    year: 2022,
    month: 1,
    day: 1,
    value: [],
  },
  lifetimes: {
    attached: function () {
      const that = this;
      const date = new Date();
      const month = date.getMonth();
      const day = date.getDate();
      const years = [];
      const months = [];
      const days = [];
      const year = date.getFullYear();

      for (let i = year - 1; i < year + 2; i++) {
        years.push(i);
      }

      for (let i = 1; i <= 12; i++) {
        months.push(i);
      }

      for (let i = 1; i <= 31; i++) {
        days.push(i);
      }

      that.setData({
        years,
        months,
        days,
        year,
        day,
        month: month + 1,
        value: [1, month, day - 1],
      });
    },
  },
  methods: {
    onChange: function (e) {
      const that = this;
      const { years, months, value } = that.data;
      let days = that.data.days;
      const val = e.detail.value;
      const year = years[val[0]];
      const month = months[val[1]];
      const _data = {
        month,
        year,
        value: val,
      };
      const month1 = that.data.month;
      if (
        month != month1 ||
        ((month1 == 2 || month == 2) && year != that.data.year)
      ) {
        let dayNum = Dates.getDayNum(year, month);
        days = [];
        for (let i = 1; i <= dayNum; i++) {
          days.push(i);
        }
        if (days.length <= val[2]) {
          val[2] = days.length - 1;
        }
        _data.days = days;
      }
      _data.day = days[val[2]];

      that.setData(_data);
    },
    onClose: function () {
      this._tapEvent(false);
    },
    onTap: function () {
      const that = this;
      const { year, month, day, mode } = that.data;
      const monstr = _formatNumber(month);
      const daystr = _formatNumber(day);

      const date = new Date(year, month - 1, day, 23, 50);
      const num = that._getSeveralDay(date.getTime());
      if(parseInt(mode) == 1 && (num < -1 || num > 1)) {
        wx.showToast({
          icon: 'none',
          title: '只能选昨天，今天，明天',
        });
        return;
      }
      that._tapEvent(true, {
        date: [year, monstr, daystr],
        time: date.getTime(),
      });
    },
    // 获取相差天数
    _getSeveralDay: function (time) {
      const second = Date.now() - time;
      const day = Math.ceil(second / 86400000); // 24 * 60 * 60000
      return day;
    },
    _tapEvent: function (status, data = []) {
      this.triggerEvent('change', { status, data });
    },
  },
});
