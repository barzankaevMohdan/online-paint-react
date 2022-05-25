export default class Tool {

  constructor(canvas, socket, id) {
    this.socket = socket
    this.id = id
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.fillStyle = 'black'
    this.strokeStyle = 'black'
    this.lineWidth = 1
    this.destroyEvents()
  }

  
  set fill(color) {
    this.fillStyle = color
    this.ctx.fillStyle = color
  }

  set color(color) {
    this.strokeStyle = color
    this.ctx.strokeStyle = color
  }

  set line(size) {
    this.lineWidth = size
    this.ctx.lineWidth = size
  }

  destroyEvents() {
    this.canvas.onmouseup = null
    this.canvas.onmousedown = null
    this.canvas.onmousemove = null
  }
}