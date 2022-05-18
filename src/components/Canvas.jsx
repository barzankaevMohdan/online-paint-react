import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import Brush from '../tools/Brush'

export const Canvas = observer(() => {
  const canvasRef = useRef()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    // дефолтный инструмент при инициализации - кисточка
    toolState.setTool(new Brush(canvasRef.current))
  }, [])

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
  }

  return (
    <div className='canvas'>
      <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={1024} height={768}></canvas>
    </div>
  )
})
