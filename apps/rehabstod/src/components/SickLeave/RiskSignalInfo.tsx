import { RiskSignal } from '../../schemas/sickLeaveSchema'
import { classNames } from '../../utils/classNames'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'

function RiskSignalCircle({ riskCategory, index }: { riskCategory: number; index: number }) {
  return (
    <span
      data-testid="riskSignalRing"
      className={classNames(
        'block h-2.5 w-2.5 rounded-full border border-solid',
        riskCategory <= index ? 'bg-white' : riskCategory === 3 && 'bg-error-40',
        riskCategory === 2 && 'bg-error-10',
        riskCategory === 1 && 'bg-attention-40'
      )}
    />
  )
}

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
