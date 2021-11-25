import React from 'react'

const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_UNIT_TITLE = 'Behörighet saknas.'
const AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_UNIT_MESSAGE =
  'Du saknar behörighet att hantera detta intyg. ' +
  'För att hantera ett intyg för en patient med skyddade personuppgifter måste du vara inloggad på den vårdenhet intyget skrevs.'

const AuthorizationProblemConfidentialityMarkingUnit: React.FC = () => {
  return (
    <>
      <p>
        <strong>{AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_UNIT_TITLE}</strong>
      </p>
      <p>{AUTHORIZATION_PROBLEM_CONFIDENTIALITY_MARKING_UNIT_MESSAGE}</p>
    </>
  )
}

export default AuthorizationProblemConfidentialityMarkingUnit
