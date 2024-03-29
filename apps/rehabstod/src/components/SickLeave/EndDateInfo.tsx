import { IDSTooltip } from '@frontend/ids-react-ts'

export function EndDateInfo({ date, isDateAfterToday }: { date: string; isDateAfterToday: boolean }) {
  return !isDateAfterToday ? (
    <p>{date}</p>
  ) : (
    <IDSTooltip>
      <p className="font-bold" slot="trigger">
        {date}
      </p>
      <p slot="tooltip">Sjukfallet är avslutat</p>
    </IDSTooltip>
  )
}
