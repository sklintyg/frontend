import { ModalProps } from './ModalUtils'
import React from 'react'
import ErrorModalBase from './ErrorModalBase'

const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_TITLE = 'Behörighet saknas.'
const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_MESSAGE =
  'För att hantera intyg för patienter med skyddade personuppgifter krävs att du har befattningen läkare eller tandläkare. Vissa intygstyper får inte hanteras alls för patienter med skyddade personuppgifter, även om du har befattningen som krävs.'

const AuthorizationProblemConfidentialityMarking: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_TITLE}</strong>
      </p>
      <p>{AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default AuthorizationProblemConfidentialityMarking
