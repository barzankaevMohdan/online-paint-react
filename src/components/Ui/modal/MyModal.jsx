import React from 'react'
import classes from './MyModal.module.scss'

export const MyModal = ({children, visible, setVisible}) => {

  const rootClasses = [classes.myModal] // классы для модалки

  if (visible) { // если visible добавляем класс active
    rootClasses.push(classes.active)
  }

  return (
    <div
      // добавляем классы путем соединения значений массива через метод join, нужно чтобы добавлять классы в массив по условию и после соеденить их в className
      className={rootClasses.join(' ')}
      onClick={() => setVisible(false)}
    >
      <div className={classes.myModalContent} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
