import { classNames, Icon } from '@frontend/components'
import { Fragment } from 'react/jsx-runtime'

export function SickLeaveDegreeInfo({
  degrees,
  activeDegree,
  minimal = false,
}: {
  degrees: number[]
  activeDegree?: number
  minimal?: boolean
}) {
  if (degrees.length === 0) {
    return <span>Okänt</span>
  }

  return (
    <div className="truncate">
      {degrees.map((degree, index) => {
        if (minimal && index > 0 && index < degrees.length - 1) {
          return null
        }

        return (
          <Fragment key={`degree${degree}-icon`}>
            {index > 0 && (
              <div className="inline-block px-0.5">
                <Icon icon="arrow-right-small" className="pt-0.5" />
              </div>
            )}
            <span className={classNames(activeDegree === degree && 'font-bold')} key={`degree${degree}`}>
              {degree}%
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}
