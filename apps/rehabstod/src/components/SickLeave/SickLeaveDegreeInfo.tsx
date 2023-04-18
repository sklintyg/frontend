import { IDSIcon } from '@frontend/ids-react-ts'

export function SickLeaveDegreeInfo({ degrees }: { degrees: number[] }) {
  const hasSeveralDegrees = degrees.length > 1

  return (
    <div className="flex gap-1 whitespace-nowrap">
      <span className="font-bold">{degrees[0]}%</span>
      {hasSeveralDegrees && (
        <>
          <IDSIcon name="arrow" size="xs" className="my-auto" color="currentColor" color2="currentColor" />
          {degrees[degrees.length - 1]}%
        </>
      )}
    </div>
  )
}
