import React from 'react'
import { Spinner } from '..'

interface Props {
  open: boolean
  spinnerText?: string
}

const SpinnerBackdrop: React.FC<Props> = ({ open, spinnerText, children }) => {
  if (!open) return <>{children}</>

  return (
    <div className="ic-backdrop iu-flex-center">
      <Spinner text={spinnerText} />
    </div>
  )
}

export default SpinnerBackdrop
