import React from 'react'
import toolState from '../store/toolState'
import { useParams } from 'react-router-dom'
import Brush from '../tools/Brush'
import Rect from '../tools/Rect'
import canvasState from '../store/canvasState'
import Circle from '../tools/Circle'
import Eraser from '../tools/Eraser'
import Line from '../tools/Line'
import api from '../Api/ImageService'

export const Toolbar = () => {
  const params = useParams()

  const changeColor = (e) => {
    toolState.setFillColor(e.target.value)
    toolState.setStrokeColor(e.target.value)
  }

  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL()
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = canvasState.sessionId
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const clear = () => {
    canvasState.socket.send(JSON.stringify({
      method: 'draw',
      id: params.id,
      draw: {
        type: 'clear',
      }
    }))
    canvasState.clear()
    api.postImage(params.id, canvasState.canvas.toDataURL())
  }

  const undo = () => {
    canvasState.socket.send(JSON.stringify({
      id: params.id,
      method: 'draw',
      draw: {
        type: 'undo',
      }
    }))
    api.postImage(params.id, canvasState.canvas.toDataURL())
  }

  const redo = () => {
    canvasState.socket.send(JSON.stringify({
      id: params.id,
      method: 'draw',
      draw: {
        type: 'redo',
      }
    }))
    api.postImage(params.id, canvasState.canvas.toDataURL())
  }

  return (
    <div className='toolbar'>
      <button className='toolbar__btn brush' onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn rect' onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn circle' onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn eraser' onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn line' onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <input className='toolbar__btn' type="color" onChange={e => changeColor(e)} />
      <button className='toolbar__btn undo' onClick={() => undo()}/>
      <button className='toolbar__btn redo' onClick={() => redo()}/>
      <button className='toolbar__btn save' onClick={() => download()}/>
      <button className='toolbar__btn delete' onClick={() => clear()}/>
    </div>
  )
}
