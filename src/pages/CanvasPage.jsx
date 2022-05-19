import React from 'react'
import {Toolbar} from '../components/Toolbar'
import {SettingBar} from '../components/SettingBar'
import {Canvas} from '../components/Canvas'

const CanvasPage = () => {
  return (
    <div className="App">
      <Toolbar/>
      <SettingBar/>
      <Canvas/>
    </div>
  )
}

export default CanvasPage;