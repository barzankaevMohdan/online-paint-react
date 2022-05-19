import { makeAutoObservable } from "mobx";

class CanvasState {
  canvas = null
  socket = null
  sessionId = null
  undoList = []
  redoList = []
  username = ''

  constructor() {
    makeAutoObservable(this)
  }

  setSessionId(id) {
    this.sessionId = id
  }

  setSocket(socket) {
    this.socket = socket
  }

  setCanvas(canvas) {
    this.canvas = canvas
  }

  setUsername(name) {
    this.username = name
  }

  pushToUndo(data) {
    this.undoList.push(data)
  }

  pushToRedo(data) {
    this.redoList.push(data)
  }

  undo() {
    const ctx = this.canvas.getContext('2d')
    if (!this.undoList.length) return
    const dataUrl = this.undoList.pop()
    this.redoList.push(this.canvas.toDataURL())
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
    }
  }

  redo() {
    const ctx = this.canvas.getContext('2d')
    if (!this.redoList.length) return
    const dataUrl = this.redoList.pop()
    this.undoList.push(this.canvas.toDataURL())
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
    }
  }

  clear() {
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

export default new CanvasState()