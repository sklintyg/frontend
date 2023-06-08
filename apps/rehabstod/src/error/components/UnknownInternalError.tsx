const UNKNOWN_INTERNAL_PROBLEM_TITLE = 'Ett tekniskt problem inträffade'
const UNKNOWN_INTERNAL_PROBLEM_MESSAGE = 'Försök igen och kontakta supporten om problemet kvarstår.'

export function UnknownInternalError() {
  return (
    <>
      <h1 className="ids-heading-1">{UNKNOWN_INTERNAL_PROBLEM_TITLE} </h1>
      <p className="ids-preamble">{UNKNOWN_INTERNAL_PROBLEM_MESSAGE}</p>
    </>
  )
}
