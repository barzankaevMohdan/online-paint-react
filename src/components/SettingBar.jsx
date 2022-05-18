import React from 'react'
import toolState from '../store/toolState'

export const SettingBar = () => {
  return (
    <div className='toolbar'>
      <label htmlFor="line-width">Толщина линии</label>
      <input
        onChange={(e) => toolState.setLineWidth(e.target.value)}
        id='line-width'
        type="number"
        defaultValue={1}
        min={1}
        max={50}
      />
      <label htmlFor="stroke-color">Цвет обводки</label>
      <input
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
        id='stroke-color'
        type="color"
        className='toolbar__btn'
      />
    </div>
  )
}
