import { RiskSignal } from '../../schemas/sickLeaveSchema'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'
import { RiskSignalCircle } from './RiskSignalCircle'

export function RiskSignalInfo({ riskKategori, riskDescription }: RiskSignal) {
  return (
    <Tooltip>
      <TooltipTrigger>
        {riskKategori != null && riskKategori > 0 ? (
          <div className="flex">
            {Array.from({ length: 3 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <RiskSignalCircle key={i} riskCategory={riskKategori} index={i} />
            ))}
          </div>
        ) : (
          <div className="h-6 w-6">
            <hr className="h-px w-4" data-testid="noRiskSignalSymbol" />
          </div>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span className="rounded-none">{riskDescription}</span>
      </TooltipContent>
    </Tooltip>
  )
}
