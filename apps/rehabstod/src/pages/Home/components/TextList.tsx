import { SummaryDataPoint } from '../../../schemas/sickLeaveSchema'
import { Tooltip } from '../../../components/Tooltip/Tooltip'
import { TooltipTrigger } from '../../../components/Tooltip/TooltipTrigger'
import { TooltipContent } from '../../../components/Tooltip/TooltipContent'

export function TextList({ data, parentData }: { parentData: SummaryDataPoint[]; data: SummaryDataPoint[] }) {
  return (
    <ul className="mx-5 list-disc">
      {data.map((dataPoint) => (
        <Tooltip key={dataPoint.name}>
          <TooltipTrigger asChild>
            <li
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex={dataPoint.description ? 0 : undefined}
              className="leading-tight marker:text-2xl"
              style={{ color: parentData && parentData.find((point) => point.id === dataPoint.id)?.fill }}>
              <span className="text-neutral-20 align-top text-xs">{dataPoint.name}</span>
            </li>
          </TooltipTrigger>
          {dataPoint.description && <TooltipContent>{dataPoint.description}</TooltipContent>}
        </Tooltip>
      ))}
    </ul>
  )
}
