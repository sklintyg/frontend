import React from 'react'

interface Props {
  text?: string
  size?: 'small' | 'large' | undefined
}

const Spinner: React.FC<Props> = ({ text, size }) => {
  return (
    <div>
      <div className="ic-spinner">
        <div className="ic-spinner__bounce1"></div>
        <div className="ic-spinner__bounce2"></div>
        <div className="ic-spinner__bounce3"></div>
      </div>
      <p className={`${size === 'small' ? 'iu-fs-200' : 'iu-fs-500'} iu-pt-300`}>{text}</p>
    </div>
  )
}

export default Spinner
