import Tool from "./Tool";
export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen()
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
  }

  mouseDownHandler(e) {
    this.mouseDown = true
    this.startX = e.pageX-e.target.offsetLeft
    this.startY = e.pageY-e.target.offsetTop
    this.ctx.beginPath()
    this.ctx.moveTo(this.startX, this.startY )
    this.saved = this.canvas.toDataURL()
  }

  mouseUpHandler(e) {
    this.mouseDown = false
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'line',
        x: e.pageX-e.target.offsetLeft,
        y: e.pageY-e.target.offsetTop,
        startX: this.startX,
        startY: this.startY,
        color: this.ctx.strokeStyle,
        lineWidth: this.ctx.lineWidth,
      }
    }))
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'finish',
      }
    }))
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.draw(e.pageX-e.target.offsetLeft, e.pageY-e.target.offsetTop);
    }
  }


  draw(x,y) {
    const img = new Image()
    img.src = this.saved
    img.onload = () => {
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.moveTo(this.startX, this.startY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
    }
  }

  static staticDraw(ctx, x, y, startX, startY, color, lineWidth) {
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}