export default class PaperReader {
  constructor (obj) {
    this.width = obj.width;
    this.height = obj.height;
    this.message = obj.message;
    obj.el.innerHTML = `<canvas width="${this.width}" height="${this.height}"></canvas>`;
    let canvas = obj.el.querySelector('canvas');
    let context = canvas.getContext('2d');
    let _self = this;
    // 记录上一次与本次事件的坐标
    let current, last;
    setInterval(function () {
      if (_self.message.length) {
        last = _self.message.shift();
        _self.factor = Math.min(_self.width / last.width, _self.height / last.height);
        while (_self.message.length) {
          current = _self.message.shift();
          context.beginPath();
          context.moveTo(last.x * _self.factor, last.y * _self.factor);
          context.lineTo(current.x * _self.factor, current.y * _self.factor);
          context.stroke();
          context.closePath();
          last = current;
        }
      }
    }, 500);
  }
};

