import { classNames } from '@frontend/components'

export function RiskSignalCircle({ riskCategory, index }: { riskCategory: number; index: number }) {
  return (
    <span
      data-testid="riskSignalRing"
      data-riskCategory={riskCategory}
      className={`block h-2.5 w-2.5 rounded-full border border-solid ${
        riskCategory <= index
          ? 'bg-white'
          : classNames(riskCategory === 3 && 'bg-srs-high', riskCategory === 2 && 'bg-srs-medium', riskCategory === 1 && 'bg-srs-low')
      }`}
    />
  )
}
