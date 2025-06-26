import type React from 'react'
import { getUser } from '../../../store/user/userSelectors'
import { useAppSelector } from '../../../store/store'

export const TIMEOUT_TITLE = 'Du är utloggad'
export const TIMEOUT_MESSAGE_ORIGIN_INTEGRATED =
  'Du har blivit utloggad från Webcert på grund av inaktivitet. ' +
  'Om du vill fortsätta använda Webcert behöver du öppna intyget från journalsystemet.'
export const TIMEOUT_MESSAGE_ORIGIN_NORMAL =
  'Du har blivit utloggad från Webcert på grund av inaktivitet. Om du vill fortsätta använda Webcert behöver du logga in igen.'
export const GO_TO_START_TEXT = 'Gå till startsidan'

const Timeout = () => {
  const origin = useAppSelector((state) => getUser(state)?.origin)

  if (origin == 'NORMAL') {
    return (
      <>
        <p>
          <strong>{TIMEOUT_TITLE}</strong>
        </p>
        <p>{TIMEOUT_MESSAGE_ORIGIN_NORMAL}</p>
        <p>
          <a href={'/'}>{GO_TO_START_TEXT}</a>
        </p>
      </>
    )
  }
  return (
    <>
      <p>
        <strong>{TIMEOUT_TITLE}</strong>
      </p>
      <p>{TIMEOUT_MESSAGE_ORIGIN_INTEGRATED}</p>
    </>
  )
}

export default Timeout
