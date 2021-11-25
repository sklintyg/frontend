import { ModalProps } from './ModalUtils'
import React from 'react'
import ErrorModalBase from './ErrorModalBase'
import WCDynamicLink from '../../utils/WCDynamicLink'

const PU_PROBLEM_TITLE = 'Meddelandet har inte skickats till Försäkringskassan då Webcert saknar kontakt med Försäkringskassans datasystem.'
const PU_PROBLEM_MESSAGE =
  'Prova att skicka om meddelandet. Om problemet kvarstår, kontakta i förstahand din lokala IT-avdelning och i andrahand '
const PU_PROBLEM_MESSAGE2 = ' på 0771-251010.'

const PuProblem: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{PU_PROBLEM_TITLE}</strong>
      </p>
      <p>
        {PU_PROBLEM_MESSAGE} <WCDynamicLink linkKey={'ineraKundserviceAnmalFel'} />${PU_PROBLEM_MESSAGE2}
      </p>
    </ErrorModalBase>
  )
}

export default PuProblem
