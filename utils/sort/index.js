/**
 * Author: Meng
 * Date: 2022-03
 * Desc: 字符串排序
 */

const Letter = "*ABCDEFGHJKLMNOPQRSTWXYZ".split(""); // ABCDEFGHJKLMNOPQRSTWXYZ/abcdefghjklmnopqrstwxyz
const ZH = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");

function sortStr(strs = []) {
  let list = ["快上课", "嗷嗷"];
  function sortChinese(items) {
    // 参数： 排序的数组
    items.sort(function (item1, item2) {
      // console.log(item1);
      return item1.localeCompare(item2, "zh-CN");
    });
  }
  sortChinese(list);
  // console.log(list);
}

function sortArray() {
  let list = [
    { name: "南京", code: "09", info: { province: "江苏" } },
    { name: "北京", code: "01", info: { province: "北京" } },
    { name: "上海", code: "02", info: { province: "上海" } },
    { name: "深圳", code: "05", info: { province: "广东" } },
  ];

  function sortChinese(items) {
    // 参数： 排序的数组
    items.sort(function (item1, item2) {
      return item1.name.localeCompare(item2.name, "zh-CN");
    });
  }
  sortChinese(list);
}

export function sortCity(items, dataLeven) {
  function getValue(option) {
    return option[dataLeven];
  }
  /* 进行排序 */
  items.sort(function (item1, item2) {
    return getValue(item1).localeCompare(getValue(item2), "zh"); // zh-Hans-CN
  });
  // 判断字符串是否含有中文
  // if (/[\u4e00-\u9fff]/.test(getValue(items[0]))) {}
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    for (let li = 0; li < Letter.length; li++) {
      // 是否有值 && 当前值大于等于本次字母的最小值 && (最后一位 || 当前值小于下次字母的最小值)
      let state = getValue(item).localeCompare(ZH[li], "zh") >= 0;
      // console.log(state)
      if (state) {
        // 满足条件，同一个首字母下的：例如 A 下的所有省份
        item.letter = Letter[li];
        continue;
      }
    }
  }

  const citys = [];
  for (const key of Letter) {
    const city = items.filter((e) => e.letter == key);
    if (city.length > 0) {
      citys.push({ key, city });
    }
  }
  return citys;
}

export function newSortCity(arr, key) {
  if (!String.prototype.localeCompare) return null;

  const letters = "*abcdefghjklmnopqrstwxyz".split("");
  const zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");

  const soryGroup = [];
  let list;
  try {
    letters.forEach(function (item, i) {
      list = { key: item, city: [] };
      arr.forEach(function (item2) {
        const str = item2[key];
        if (
          (!zh[i - 1] || zh[i - 1].localeCompare(str) <= 0) &&
          str.localeCompare(zh[i]) == -1
        ) {
          list.city.push(item2);
        }
      });
      if (list.city.length) {
        soryGroup.push(list);
        list.city.sort(function (a, b) {
          return a[key].localeCompare(b[key]);
        });
      }
    });
  } catch (error) {
    console.log("=============> soryGroup err");
    console.log(error);
  }
  return soryGroup;
}
