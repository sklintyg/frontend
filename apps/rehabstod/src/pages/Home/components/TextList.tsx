import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/Tooltip'
import type { SummaryDataPoint } from '../../../schemas/sickLeaveSchema'

export function TextList({ data, parentData }: { parentData: SummaryDataPoint[]; data: SummaryDataPoint[] }) {
  return (
    <ul className="list-disc leading-tight">
      {data.map((dataPoint) => (
        <Tooltip key={dataPoint.name}>
          <TooltipTrigger asChild>
            <li
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={dataPoint.description ? 0 : undefined}
              className="marker:text-3xl"
              style={{ color: parentData && parentData.find((point) => point.id === dataPoint.id)?.fill }}
            >
              <span className="align-super text-sm text-neutral-20">{dataPoint.name}</span>
            </li>
          </TooltipTrigger>
          {dataPoint.description && <TooltipContent>{dataPoint.description}</TooltipContent>}
        </Tooltip>
      ))}
    </ul>
  )
}
