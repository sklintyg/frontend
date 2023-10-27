import { classNames } from '@frontend/components'
import { IDSIconArrow } from '@frontend/ids-react-ts'

export function SickLeaveDegreeInfo({ degrees, activeDegree }: { degrees: number[]; activeDegree?: number }) {
  if (degrees.length === 0) {
    return <span>Okänt</span>
  }

  return (
    <div className="flex gap-1 whitespace-nowrap">
      {degrees.map((degree, index) => (
        <>
          {index > 0 && (
            <IDSIconArrow key={`degree${degree}-icon`} size="xs" className="my-auto" color="currentColor" color2="currentColor" />
          )}
          <span className={classNames(activeDegree === degree && 'font-bold')} key={`degree${degree}`}>
            {degree}%
          </span>
        </>
      ))}
    </div>
  )
}
