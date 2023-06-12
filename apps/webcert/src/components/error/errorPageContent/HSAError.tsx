import React from 'react'
import { Link } from 'react-router-dom'
import WCDynamicLink from '../../../utils/WCDynamicLink'

const HSAError: React.FC = () => {
  return (
    <>
      <p>
        <strong>Tekniskt fel</strong>
      </p>
      <p>
        Tyvärr har ett tekniskt problem uppstått i Webcert.
        <Link to="/">Försök gärna igen</Link>
        för att se om felet är tillfälligt. Kontakta annars i första hand din lokala IT-avdelning och i andra hand
        <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />.
      </p>
    </>
  )
}

export default HSAError
