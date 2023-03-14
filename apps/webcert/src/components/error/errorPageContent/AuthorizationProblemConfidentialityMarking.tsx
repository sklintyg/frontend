import React from 'react'

export const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_TITLE = 'Behörighet saknas'
export const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_MESSAGE =
  'För att hantera intyg för patienter med skyddade personuppgifter krävs att du har befattningen läkare eller tandläkare. ' +
  'Vissa intygstyper får inte hanteras alls för patienter med skyddade personuppgifter, även om du har befattningen som krävs.'

const AuthorizationProblemConfidentialityMarking: React.FC = () => {
  return (
    <>
      <p>
        <strong>{AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_TITLE}</strong>
      </p>
      <p>{AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_MESSAGE}</p>
    </>
  )
}

export default AuthorizationProblemConfidentialityMarking
