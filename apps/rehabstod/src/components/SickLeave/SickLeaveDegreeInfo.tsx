import { IDSIconArrow } from '@frontend/ids-react-ts'

export function SickLeaveDegreeInfo({ degrees }: { degrees: number[] }) {
  const hasSeveralDegrees = degrees.length > 1

  if (degrees.length === 0) {
    return <span>Okänt</span>
  }

  return (
    <div className="flex gap-1 whitespace-nowrap">
      <span>{degrees[0]}%</span>
      {hasSeveralDegrees && (
        <>
          <IDSIconArrow size="xs" className="my-auto" color="currentColor" color2="currentColor" />
          <span className="font-bold">{degrees[degrees.length - 1]}%</span>
        </>
      )}
    </div>
  )
}
