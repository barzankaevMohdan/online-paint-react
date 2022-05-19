import React from 'react'
import toolState from '../store/toolState'
import { useParams } from 'react-router-dom'
import Brush from '../tools/Brush'
import Rect from '../tools/Rect'
import canvasState from '../store/canvasState'
import Circle from '../tools/Circle'
import Eraser from '../tools/Eraser'
import Line from '../tools/Line'
import axios from 'axios'

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
      figure: {
        type: 'clear',
      }
    }))
    canvasState.clear()
    axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasState.canvas.toDataURL()})
  }

  return (
    <div className='toolbar'>
      <button className='toolbar__btn brush' onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn rect' onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn circle' onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn eraser' onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <button className='toolbar__btn line' onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
      <input className='toolbar__btn' type="color" onChange={e => changeColor(e)} />
      <button className='toolbar__btn undo' onClick={() => canvasState.undo()}/>
      <button className='toolbar__btn redo' onClick={() => canvasState.redo()}/>
      <button className='toolbar__btn save' onClick={() => download()}/>
      <button className='toolbar__btn delete' onClick={() => clear()}/>
    </div>
  )
}
