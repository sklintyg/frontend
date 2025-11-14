import { classNames } from '@frontend/components'
import { IDSIconArrow } from '@inera/ids-react'
import { Fragment } from 'react/jsx-runtime'

export function SickLeaveDegreeInfo({ degrees, activeDegree }: { degrees: number[]; activeDegree?: number }) {
  if (degrees.length === 0) {
    return <span>Okänt</span>
  }

  return (
    <div className="flex gap-1 whitespace-nowrap">
      {degrees.map((degree, index) => (
        <Fragment key={`degree${degree}-icon`}>
          {index > 0 && <IDSIconArrow size="xs" className="my-auto" color="currentColor" color2="currentColor" />}
          <span className={classNames(activeDegree === degree && 'font-bold')} key={`degree${degree}`}>
            {degree}%
          </span>
        </Fragment>
      ))}
    </div>
  )
}
