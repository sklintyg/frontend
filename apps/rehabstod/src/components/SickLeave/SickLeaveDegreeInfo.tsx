import { IDSIconArrow } from '@frontend/ids-react-ts'

export function SickLeaveDegreeInfo({ degrees }: { degrees: number[] }) {
  const hasSeveralDegrees = degrees.length > 1

  if (degrees.length === 0) {
    return <span>Okänt</span>
  }

  return (
    <div className="flex gap-1 whitespace-nowrap">
      {hasSeveralDegrees ? (
        <>
          <span className="font-bold">{degrees[0]}%</span>
          {degrees.map((degree, index) =>
            index !== 0 ? (
              <>
                <IDSIconArrow size="xs" className="my-auto" color="currentColor" color2="currentColor" />
                <span key={`degree${degree}`}>{degree}%</span>
              </>
            ) : null
          )}
        </>
      ) : (
        <span>{degrees[0]}</span>
      )}
    </div>
  )
}
