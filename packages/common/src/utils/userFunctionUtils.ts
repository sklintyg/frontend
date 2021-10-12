import React, { useEffect } from 'react'

export const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = React.useState(false)

  // @ts-ignore
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }

  // @ts-ignore
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  })

  return keyPressed
}
