import type React from 'react'

export const TIMEOUT_TITLE = 'Du är utloggad'
export const TIMEOUT_MESSAGE =
  'Du har blivit utloggad från Webcert på grund av inaktivitet. ' +
  'Om du vill fortsätta använda Webcert behöver du öppna intyget från journalsystemet.'

const Timeout: React.FC = () => {
  return (
    <>
      <p>
        <strong>{TIMEOUT_TITLE}</strong>
      </p>
      <p>{TIMEOUT_MESSAGE}</p>
    </>
  )
}

export default Timeout
