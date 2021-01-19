import React from 'react'

interface Props {
  text?: string
}

const Spinner: React.FC<Props> = ({ text }) => {
  return (
    <div>
      <div className="ic-spinner">
        <div className="ic-spinner__bounce1"></div>
        <div className="ic-spinner__bounce2"></div>
        <div className="ic-spinner__bounce3"></div>
      </div>
      <p className="iu-fs-500 iu-pt-300">{text}</p>
    </div>
  )
}

export default Spinner
