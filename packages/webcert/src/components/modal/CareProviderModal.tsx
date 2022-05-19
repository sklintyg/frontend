import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import FocusTrap from 'focus-trap-react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../store/user/userSelectors'
import { setUnit } from '../../store/user/userActions'
import { CareProviders } from './CareProviders'
import { User } from '@frontend/common'

const ModalContentWrapper = styled.div`
  p + p {
    margin-top: 0.25em !important;
  }
`

const WrapText = styled.div`
  white-space: normal;
`

interface Props {
  title: string
}

const CareProviderModal: React.FC<Props> = ({ title }) => {
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
              <h3 id="dialog-title">{title}</h3>
            </div>
            <ModalContentWrapper className="ic-modal__body ic-text">
              <CareProviders chooseUnit={handleChooseUnit} careProviders={careProviders} />
            </ModalContentWrapper>
          </WrapText>
        </div>
      </div>
    </FocusTrap>
  )
}

export default CareProviderModal
