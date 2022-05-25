import Brush from "./Brush"


export default class Eraser extends Brush {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        draw: {
          type: 'eraser',
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
          lineWidth: this.ctx.lineWidth,
        }
      }))
    }
  }

  static staticDraw(ctx, x, y, lineWidth) {
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.strokeStyle = "white"
    ctx.lineWidth = lineWidth
  }
}