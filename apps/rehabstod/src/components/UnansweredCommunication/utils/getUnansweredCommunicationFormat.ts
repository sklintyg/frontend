export function getUnansweredCommunicationFormat(unansweredComplement: number, unansweredOther: number): string {
  if (unansweredComplement + unansweredOther === 0) {
    return '-'
  }
  return [
    unansweredComplement !== 0 && `Komplettering (${unansweredComplement})`,
    unansweredOther !== 0 && `Administrativ fråga (${unansweredOther})`,
  ]
    .filter(Boolean)
    .join('\n')
}
