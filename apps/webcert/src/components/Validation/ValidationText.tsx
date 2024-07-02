import type React from 'react'

interface Props {
  id: string
  message: string
}

const ValidationText: React.FC<Props> = ({ id, message }) => {
  return (
    <p id={id} aria-live="polite" className="iu-color-error">
      {message}
    </p>
  )
}

export default ValidationText
