import React from 'react'

interface Props {
  type: 'info' | 'error' | 'success'
  additionalStyles?: string
}

const InfoBox: React.FC<Props> = ({ type, children, additionalStyles }) => {
  const getIconClass = () => {
    switch (type) {
      case 'info':
        return 'ic-info-icon'
      case 'error':
        return 'ic-error-icon'
      case 'success':
        return 'ic-success-icon'
    }
  }

  const getWrapperClass = () => {
    switch (type) {
      case 'info':
        return 'ic-alert--info'
      case 'error':
        return 'ic-alert--error'
      case 'success':
        return 'ic-alert--success'
    }
  }

  return (
    <div className={`ic-alert ic-alert--status ${getWrapperClass()}`}>
      <i className={`ic-alert__icon ${getIconClass()}`}></i>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse euismod diam nec ligula tincidunt tincidunt. Praesent eu
        posuere elit.{' '}
      </p>
    </div>
  )
}

export default InfoBox
