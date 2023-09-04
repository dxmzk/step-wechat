/**
 * Create By: Meng
 * Create Date: 2022-04
 * Desc:
 */

export default class Timer {
  _stop = false;
  timer_code = 0;
  _second = 60;
  _tag = 0;
  _func = null;

  constructor(second, func) {
    // super();
    this._func = func;
    this._tag = second;
    this._second = second;
  }

  start = () => {
    this._stop = false;
    this._tag = this._second;
    clearTimeout(this.timer_code);
    this._timer();
  };

  stop = () => {
    this._stop = true;
  };

  _timer = () => {
    this.timer_code = setTimeout(() => {
      clearTimeout(this.timer_code);
      this._tag -= 1;

      if (!this._stop && this._tag > -1 && this._func) {
        this._func(this._tag);
        this._timer();
      }
    }, 1000);
  };
}
