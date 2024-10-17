import { IDSIconArrow } from 'ids-react-ts'

export function MinimizedSickLeaveDegreeInfo({ degrees }: { degrees: number[] }) {
  if (degrees.length === 0) {
    return <span>Okänt</span>
  }

  return (
    <div className="flex gap-1 whitespace-nowrap">
      <span>{degrees[0]}%</span>
      {degrees.length > 1 && (
        <>
          <IDSIconArrow size="xs" className="my-auto" color="currentColor" color2="currentColor" />{' '}
          <span>{degrees[degrees.length - 1]}%</span>
        </>
      )}
    </div>
  )
}
