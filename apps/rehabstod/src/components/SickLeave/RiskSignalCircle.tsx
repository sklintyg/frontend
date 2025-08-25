import { classNames } from '../../utils/classNames'

export function RiskSignalCircle({ riskCategory, index }: { riskCategory: number; index: number }) {
  return (
    <span
      data-testid="riskSignalRing"
      className={`block h-2.5 w-2.5 rounded-full border border-solid ${
        riskCategory <= index
          ? 'bg-white'
          : classNames(riskCategory === 3 && 'bg-error-40', riskCategory === 2 && 'bg-graphic', riskCategory === 1 && 'bg-attention-40')
      }`}
    />
  )
}
