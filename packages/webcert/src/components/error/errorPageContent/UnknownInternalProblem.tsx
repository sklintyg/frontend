import React from 'react'

const UNKNOWN_INTERNAL_PROBLEM_TITLE = 'Ett tekniskt problem inträffade.'
const UNKNOWN_INTERNAL_PROBLEM_MESSAGE = 'Försök igen och kontakta supporten om problemet kvarstår.'

const UnknownInternalProblem: React.FC = () => {
  return (
    <>
      <p>
        <strong>{UNKNOWN_INTERNAL_PROBLEM_TITLE}</strong>
      </p>
      <p>{UNKNOWN_INTERNAL_PROBLEM_MESSAGE}</p>
    </>
  )
}

export default UnknownInternalProblem
