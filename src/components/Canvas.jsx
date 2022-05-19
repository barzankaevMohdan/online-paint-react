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
import axios from 'axios'

export const Canvas = observer(() => {
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    let ctx = canvasRef.current.getContext('2d')
    axios.get(`https://mohdan-online-paint.herokuapp.com/image?id=${params.id}`, {withCredentials: true})
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
      const socket = new WebSocket(`https://mohdan-online-paint.herokuapp.com`)
      canvasState.setSocket(socket)
      canvasState.setSessionId(params.id)
      // дефолтный инструмент при инициализации - кисточка
      toolState.setTool(new Brush(canvasRef.current, socket, params.id))
      socket.onopen = () => {
        console.log('react connect');
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection'
        }))
      }
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
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
        break
      case 'eraser':
        Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
        break
      case "rect":
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor, figure.lineWidth)
        break
      case "circle":
        Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.strokeColor, figure.lineWidth)
        break
      case "line":
        Line.staticDraw(ctx, figure.x, figure.y, figure.startX, figure.startY, figure.color, figure.lineWidth)
        break
      case 'clear':
        canvasState.clear()
        break
      case "finish":
        ctx.beginPath()
        break
      default: 
        console.log(msg)
        break
    }
  }

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
  }

  const postImage = () => {
    axios.post(`https://mohdan-online-paint.herokuapp.com/image?id=${params.id}`, {img: canvasState.canvas.toDataURL()}, {withCredentials: true})
  }

  const connectHandler = () => {
    canvasState.setUsername(usernameRef.current.value)
    setModal(false)
  }

  return (
    <div className='canvas'>
      <MyModal visible={modal} setVisible={setModal}>
        <h1>Введите ваше имя</h1>
        <input type="text" ref={usernameRef}/>
        <button onClick={() => connectHandler()}>
          Войти
        </button>
      </MyModal>
      <canvas onMouseUp={() => postImage()} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={1024} height={768}></canvas>
    </div>
  )
})
