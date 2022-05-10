import React from 'react'
import styled from 'styled-components'
import FocusTrap from 'focus-trap-react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../store/user/userSelectors'
import { setCareProvider, updateIsCareProviderModalOpen } from '../../store/user/userActions'
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
  open: boolean
  title: string
}

const CareProviderModal: React.FC<Props> = ({ open, title }) => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  const handleChooseCareProvider = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

    dispatch(setCareProvider(unitId))
    dispatch(updateIsCareProviderModalOpen(false))
  }

  if (!open || user?.careProviders.length === 0) {
    return null
  }

  const { careProviders } = user as User

  return (
    <FocusTrap active={open}>
      <div tabIndex={0}>
        <div className="ic-backdrop iu-lh-body">
          <WrapText role="dialog" className="ic-modal" aria-labelledby="dialog-title" aria-modal="true">
            <div className="ic-modal__head" id="demo-modal-content">
              <h2 id="dialog-title">{title}</h2>
            </div>
            <ModalContentWrapper className="ic-modal__body ic-text">
              <CareProviders chooseCareProvider={handleChooseCareProvider} careProviders={careProviders} />
            </ModalContentWrapper>
          </WrapText>
        </div>
      </div>
    </FocusTrap>
  )
}

export default CareProviderModal
