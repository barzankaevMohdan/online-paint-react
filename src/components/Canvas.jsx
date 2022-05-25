import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'
import Eraser from '../tools/Eraser'
import Rect from '../tools/Rect'
import Circle from '../tools/Circle'
import Line from '../tools/Line'
import { MyModal } from './Ui/modal/MyModal'
import api from '../Api/ImageService'
import {socket} from '../helpers/ws'

export const Canvas = observer(() => {
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    let ctx = canvasRef.current.getContext('2d')
    api.getImage(params.id)
      .then(response => {
        const img = new Image()
        img.src = response.data
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
          ctx.stroke()
        }
      })
  }, [])

  useEffect(() => {
    if (canvasState.username) {
      canvasState.setSocket(socket)
      canvasState.setSessionId(params.id)
      // дефолтный инструмент при инициализации - кисточка
      toolState.setTool(new Brush(canvasRef.current, socket, params.id))

      socket.send(JSON.stringify({
        id: params.id,
        username: canvasState.username,
        method: 'connection'
      }))
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data)
        switch (msg.method) {
          case 'connection':
            console.log(`пользователь ${msg.username} подключился`)
            break
          case 'draw':
            drawHandler(msg)
            break
          default: 
            console.log(msg)
            break
        }
      }
    }
  }, [canvasState.username])

  const drawHandler = (msg) => {
    const draw = msg.draw
    const ctx = canvasRef.current.getContext('2d')
    switch (draw.type) {
      case 'brush':
        Brush.staticDraw(ctx, draw.x, draw.y, draw.color, draw.lineWidth)
        break
      case 'eraser':
        Eraser.staticDraw(ctx, draw.x, draw.y, draw.lineWidth)
        break
      case "rect":
        Rect.staticDraw(ctx, draw.x, draw.y, draw.width, draw.height, draw.color, draw.strokeColor, draw.lineWidth)
        break
      case "circle":
        Circle.staticDraw(ctx, draw.x, draw.y, draw.r, draw.color, draw.strokeColor, draw.lineWidth)
        break
      case "line":
        Line.staticDraw(ctx, draw.x, draw.y, draw.startX, draw.startY, draw.color, draw.lineWidth)
        break
      case 'clear':
        canvasState.clear()
        break
      case 'undo':
        canvasState.undo()
        break
      case 'redo':
        canvasState.redo()
        break
      case "push-to-undo":
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        break
      case "finish":
        ctx.strokeStyle = toolState.tool.strokeStyle
        ctx.lineWidth = toolState.tool.lineWidth
        ctx.fillStyle = toolState.tool.fillStyle
        ctx.beginPath()
        break
      default: 
        console.log(msg)
        break
    }
  }


  const postImage = () => {
    api.postImage(params.id, canvasState.canvas.toDataURL())
  }

  const connectHandler = () => {
    canvasState.setUsername(usernameRef.current.value)
    setModal(false)
  }

  const mouseDownHandler = () => {
    socket.send(JSON.stringify({
      id: params.id,
      method: 'draw',
      draw: {
        type: 'push-to-undo',
      }
    }))
  }

  return (
    <div className='canvas'>
      <MyModal visible={modal} setVisible={setModal}>
        <h1>Введите ваше имя</h1>
        <input autoFocus type="text" ref={usernameRef}/>
        <button onClick={() => connectHandler()}>
          Войти
        </button>
      </MyModal>
      <canvas onMouseUp={() => postImage()} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={1024} height={768}></canvas>
    </div>
  )
})
