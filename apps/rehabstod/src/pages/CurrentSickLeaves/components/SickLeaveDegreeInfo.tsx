import { IDSIcon } from '@frontend/ids-react-ts'

export function SickLeaveDegreeInfo({ degrees }: { degrees: number[] }) {
  const hasSeveralDegrees = degrees.length > 1

  return (
    <div className="flex gap-2 whitespace-nowrap">
      {degrees[0]}% {hasSeveralDegrees && <IDSIcon name="arrow" size="xs" className="my-auto" />}
      {hasSeveralDegrees && degrees[degrees.length - 1]}
      {hasSeveralDegrees && '%'}
    </div>
  )
}
