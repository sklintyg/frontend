import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { Unit } from '@frontend/common'

const StyledArrow = styled(FontAwesomeIcon)`
  cursor: pointer;
`

const StyledUnitLink = styled.button`
  margin-left: 1em;
`

interface Props {
  link: string
  units: Unit[]
  id: string
  chooseCareProvider: (event: React.MouseEvent) => void
}

export const ExpandableLink: React.FC<Props> = ({ link, units, id, chooseCareProvider }) => {
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    setExpand(false)
  }, [link])

  const toggleOpen = () => {
    setExpand(!expand)
  }

  return (
    <>
      {expand && link ? (
        <div>
          <p>
            <button className="ic-link" type="button" id={id} onClick={chooseCareProvider}>
              {link}
            </button>
            <StyledArrow
              icon={faAngleUp}
              className={'iu-mt-200 iu-ml-200 iu-color-cta-dark'}
              onClick={toggleOpen}
              style={{ cursor: 'pointer' }}
            />
          </p>
          {units.map((unit) => (
            <p>
              <StyledUnitLink className="ic-link" type="button" id={unit.unitId} key={unit.unitId} onClick={chooseCareProvider}>
                {unit.unitName}
              </StyledUnitLink>
            </p>
          ))}
        </div>
      ) : (
        <>
          <button className="ic-link" type="button" id={id} onClick={chooseCareProvider}>
            {link}
          </button>
          <FontAwesomeIcon
            icon={faAngleDown}
            className={'iu-mt-200 iu-ml-200 iu-color-secondary-dark'}
            onClick={toggleOpen}
            style={{ cursor: 'pointer' }}
          />
        </>
      )}
    </>
  )
}
