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

  return (
    <div className='canvas'>
      <canvas ref={canvasRef} width={600} height={400}></canvas>
    </div>
  )
})
