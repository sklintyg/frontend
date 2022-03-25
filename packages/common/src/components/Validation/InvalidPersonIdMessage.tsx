import React from 'react'

interface Props {
  display: boolean
}

const InvalidPersonIdMessage: React.FC<Props> = ({ display }) => {
  if (!display) return null
  return <p className={'iu-color-error'}>Ange ett giltigt person- eller samordningsnummer.</p>
}
export default InvalidPersonIdMessage
