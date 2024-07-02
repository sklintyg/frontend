import type { ModalProps } from './errorUtils'
import type React from 'react'
import ErrorModalBase from './ErrorModalBase'
import WCDynamicLink from '../../../utils/WCDynamicLink'

export const EXTERNAL_SYSTEM_PROBLEM_TITLE =
  'Meddelandet har inte skickats till Försäkringskassan då Webcert saknar kontakt med Försäkringskassans datasystem.'
export const EXTERNAL_SYSTEM_PROBLEM_MESSAGE =
  'Prova att skicka om meddelandet. Om problemet kvarstår, kontakta i förstahand din lokala IT-avdelning och i andrahand '
export const EXTERNAL_SYSTEM_PROBLEM_MESSAGE_2 = ' på 0771-251010.'

const ExternalSystemProblem: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{EXTERNAL_SYSTEM_PROBLEM_TITLE}</strong>
      </p>
      <p>
        {EXTERNAL_SYSTEM_PROBLEM_MESSAGE} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />${EXTERNAL_SYSTEM_PROBLEM_MESSAGE_2}
      </p>
    </ErrorModalBase>
  )
}

export default ExternalSystemProblem
