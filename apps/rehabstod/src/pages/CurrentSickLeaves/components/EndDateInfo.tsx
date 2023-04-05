import { IDSTooltip } from '@frontend/ids-react-ts'

export function EndDateInfo({ date, isDateAfterToday }: { date: string; isDateAfterToday: boolean }) {
  return !isDateAfterToday ? (
    <p>{date}</p>
  ) : (
    <IDSTooltip>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <p className="underline" style={{ textDecorationColor: 'red' }} slot="trigger" tabIndex={0}>
        {date}
      </p>
      <p slot="tooltip">Sjukfallet är avslutat</p>
    </IDSTooltip>
  )
}
