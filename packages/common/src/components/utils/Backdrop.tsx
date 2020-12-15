import React from 'react'
import { Spinner } from '..'

interface Props {
  open: boolean
  spinnerText: string
}

const Backdrop: React.FC<Props> = ({ open, spinnerText, children }) => {
  if (!open) return <>{children}</>

  return (
    <div className="ic-backdrop">
      <div role="dialog" className="ic-modal">
        <Spinner text={spinnerText} />
      </div>
    </div>
  )
}

export default Backdrop
