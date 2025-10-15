import { IDSTooltip } from '@inera/ids-react'

export function EndDateInfo({ date, isDateAfterToday }: { date: string; isDateAfterToday: boolean }) {
  return !isDateAfterToday ? (
    <p>{date}</p>
  ) : (
    <IDSTooltip trigger={<p className="font-bold">{date}</p>}>
      <p>Sjukfallet är avslutat</p>
    </IDSTooltip>
  )
}
