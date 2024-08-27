import { Link } from 'react-router-dom'
import { ContactSupportMessage } from '../ContactSupportMessage'

export function HSAError() {
  return (
    <>
      <p>
        <strong>Tekniskt fel</strong>
      </p>
      <p>
        Tyvärr har ett tekniskt problem uppstått i Webcert. <Link to="/">Försök gärna igen</Link> för att se om felet är tillfälligt.{' '}
        <ContactSupportMessage />
      </p>
    </>
  )
}
