import type { ReactNode } from 'react'
import Spinner from './Spinner'

interface Props {
  open: boolean
  spinnerText?: string
  children?: ReactNode
}

const SpinnerBackdrop = ({ open, spinnerText, children }: Props) => {
  if (!open) return <>{children}</>

  return (
    <div className="ic-backdrop iu-flex-center">
      <Spinner text={spinnerText} />
    </div>
  )
}

export default SpinnerBackdrop
