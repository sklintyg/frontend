import { TooltipIcon } from '../TooltipIcon/TooltipIcon'
import { DatePicker } from './DatePicker'

export function DateRangeInput({ title, description, to, from }: { title: string; description: string; to: string; from: string }) {
  return (
    <div>
      <div className="mb-3">
        <span>{title}</span>
        <TooltipIcon description={description} name="question" size="s" className="relative top-1 ml-2" />
      </div>
      <div className="flex w-fit gap-3">
        <DatePicker label="Från" onChange={console.log} />
        {/* <DatePicker label="Från" value={parseDate(from)} onChange={console.log} />
        <DatePicker label="Till" value={parseDate(to)} onChange={console.log} /> */}
      </div>
    </div>
  )
}
