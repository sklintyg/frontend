import _ from 'lodash'
import { RiskSignal } from '../../schemas/sickLeaveSchema'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'
import { TooltipContent } from '../Tooltip/TooltipContent'

export function RiskSignalInfo({ riskSignal }: { riskSignal: RiskSignal }) {
  if (!riskSignal) {
    return null
  }
  const getColor = (riskCategory: number | null, index: number) => {
    if (!riskCategory) {
      return ''
    }

    if (riskCategory <= index) {
      return 'bg-white'
    }

    if (riskCategory === 3) {
      return 'bg-error-40'
    }

    if (riskCategory === 2) {
      return 'bg-error-10'
    }

    return 'bg-attention-40'
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        {riskSignal.riskKategori && riskSignal.riskKategori > 0 ? (
          <div className="flex">
            {_.range(0, 3).map((i) => (
              <span
                data-testid="riskSignalRing"
                className={`block h-2.5 w-2.5 rounded-full border border-solid ${getColor(riskSignal.riskKategori, i)}`}
                key={`riskSignal-${i}`}
              />
            ))}
          </div>
        ) : (
          <hr className="h-px w-4" data-testid="noRiskSignalSymbol" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <span className="rounded-none">{riskSignal.riskDescription}</span>
      </TooltipContent>
    </Tooltip>
  )
}
