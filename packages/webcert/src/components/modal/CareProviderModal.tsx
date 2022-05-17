import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import FocusTrap from 'focus-trap-react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../store/user/userSelectors'
import { setUnit } from '../../store/user/userActions'
import { Unit, User } from '@frontend/common'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StyledArrow = styled(FontAwesomeIcon)`
  cursor: pointer;
`

const ModalContentWrapper = styled.div`
  p + p {
    margin-top: 0.25em !important;
  }
`

const WrapText = styled.div`
  white-space: normal;
  transform: none;
  margin-left: -19.375rem;
  margin-top: -40vh;
`

interface ExpandableTableRowProps {
  careUnit: string
  careUnitId: string
  units: Unit[]
  handleChooseUnit: (event: React.MouseEvent) => void
}

const ExpandableTableRow: React.FC<ExpandableTableRowProps> = ({ careUnit, careUnitId, units, handleChooseUnit }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleOpen = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <tr>
        <td>
          <StyledArrow icon={isExpanded ? faAngleUp : faAngleDown} className="iu-color-cta-dark iu-mr-300" onClick={toggleOpen} />
          <button className="ic-link iu-text-left" type="button" id={careUnitId} onClick={handleChooseUnit}>
            {careUnit}
          </button>
        </td>
        <td>0</td>
        <td>0</td>
      </tr>
      {units && units.map((unit) => <ExpandedUnit isExpanded={isExpanded} unit={unit} handleChooseUnit={handleChooseUnit} />)}
    </>
  )
}

interface ExpandedUnitProps {
  isExpanded: boolean
  unit: Unit
  handleChooseUnit: (event: React.MouseEvent) => void
}

const ExpandedUnit: React.FC<ExpandedUnitProps> = ({ unit, isExpanded, handleChooseUnit }) => {
  if (!isExpanded) {
    return null
  }

  return (
    <tr>
      <td>
        <button className="ic-link iu-ml-700 iu-text-left" type="button" id={unit.unitId} onClick={handleChooseUnit}>
          {unit.unitName}
        </button>
      </td>
      <td>0</td>
      <td>0</td>
    </tr>
  )
}

const CareProviderModal: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const [isOpen, setIsOpen] = useState(false)

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

    dispatch(setUnit(unitId))
    setIsOpen(false)
  }

  useEffect(() => {
    if (user) {
      if (user.loggedInUnit.unitId) {
        return
      }

      setIsOpen(true)
    }
  }, [user, dispatch])

  if (!isOpen || user?.careProviders.length === 0) {
    return null
  }

  const { careProviders } = user as User

  return (
    <FocusTrap active={isOpen}>
      <div tabIndex={0}>
        <div className="ic-backdrop iu-lh-body">
          <WrapText role="dialog" className="ic-modal" aria-labelledby="dialog-title" aria-modal="true">
            <div className="ic-modal__head" id="demo-modal-content">
              <h3 id="dialog-title">Välj vårdenhet</h3>
            </div>
            <ModalContentWrapper className="ic-modal__body ic-text">
              {careProviders.map((careProvider) => {
                return (
                  <table className="ic-table iu-fullwidth">
                    <thead>
                      <tr>
                        <th>{careProvider.name}</th>
                        <th>Ej hanterade ärenden</th>
                        <th>Ej signerade utkast</th>
                      </tr>
                    </thead>
                    <tbody>
                      {careProvider.careUnits.map((careUnit) => {
                        return (
                          <ExpandableTableRow
                            careUnit={careUnit.unitName}
                            careUnitId={careUnit.unitId}
                            units={careUnit.units}
                            handleChooseUnit={handleChooseUnit}
                          />
                        )
                      })}
                    </tbody>
                  </table>
                )
              })}
            </ModalContentWrapper>
          </WrapText>
        </div>
      </div>
    </FocusTrap>
  )
}

export default CareProviderModal
