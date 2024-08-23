import moment from "moment";

export default class DateUtil {
  static getWeekdayString(dateStr) {
    if (!dateStr) return "";
    var d = DateUtil.diffDays(dateStr);
    if (d == 0) {
      return "今天";
    } else if (d == 1) {
      return "明天";
    } else if (d == 2) {
      return "后天";
    } else {
      var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      var myDate = new Date(Date.parse(dateStr));
      return weekDay[myDate.getDay()];
    }
  }

  /**
   * 0:今天
   * 1:明天
   * -1:昨天
   * @param {*} dataStr
   * @returns
   */
  static diffDays(dataStr) {
    var td = new Date();
    td = new Date(td.getFullYear(), td.getMonth(), td.getDate());
    var od = new Date(dataStr);
    od = new Date(od.getFullYear(), od.getMonth(), od.getDate());
    var xc = (od - td) / 1000 / 60 / 60 / 24;
    return xc;
  }

  static formatHanDate(date) {
    if (date) {
      if (date.indexOf(":") > 0) {
        return moment(date, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY年MM月DD日 HH:mm:ss"
        );
      } else {
        return moment(date, "YYYY-MM-DD").format("YYYY年MM月DD日");
      }
    }
    return "";
  }

  static formatHanShortDate(date) {
    if (date) {
      return moment(date, "YYYY-MM-DD").format("MM月DD日");
    }
    return "";
  }
}
