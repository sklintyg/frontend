export function UnansweredCommunicationInfo({ complements, others }: { complements: number; others: number }) {
  return complements > 0 || others > 0 ? (
    <>
      {complements > 0 && <span>Komplettering ({complements})</span>}
      {others > 0 && <span>Administrativ fråga ({others})</span>}
    </>
  ) : (
    <span>-</span>
  )
}
