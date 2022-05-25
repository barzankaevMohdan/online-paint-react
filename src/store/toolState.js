import { makeAutoObservable } from "mobx";

class ToolState {
  tool = null

  constructor() {
    makeAutoObservable(this)
  }

  setTool(tool) {
    const oldTool = this.tool
    this.tool = tool
    if (oldTool) {
      this.tool.fill = oldTool.fillStyle
      this.tool.color = oldTool.strokeStyle
      this.tool.line = oldTool.lineWidth
    }
  }

  setFillColor(color) {
    this.tool.fill = color
  }

  setStrokeColor(color) {
    this.tool.color = color
  }

  setLineWidth(size) {
    this.tool.line = size
  }
}

export default new ToolState()