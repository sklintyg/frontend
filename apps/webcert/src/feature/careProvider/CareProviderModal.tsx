import { CustomButton, ModalBase, ResourceLinkType } from '@frontend/common'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import { selectIsLoadingUserStatistics, getIsCareProviderModalOpen, getUserResourceLinks } from '../../store/user/userSelectors'
import { CareProviderModalContent } from './CareProviderModalContent'

const ModalBaseLarge = styled(ModalBase)`
  max-width: 55rem;
`

const CareProviderModal: React.FC = () => {
  const dispatch = useDispatch()
  const isLoadingUserStatistics = useSelector(selectIsLoadingUserStatistics, _.isEqual)
  const isCareProviderModalOpen = useSelector(getIsCareProviderModalOpen)
  const userLinks = useSelector(getUserResourceLinks)

  const chooseUnitLink = userLinks?.find((link) => link.type === ResourceLinkType.CHOOSE_UNIT)
  const changeUnitLink = userLinks?.find((link) => link.type === ResourceLinkType.CHANGE_UNIT)

  const getModalTitle = () => {
    if (chooseUnitLink) {
      return chooseUnitLink.name
    } else if (changeUnitLink) {
      return changeUnitLink.name
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (chooseUnitLink) {
      dispatch(updateIsCareProviderModalOpen(true))
    }
  })

  const handleClose = () => {
    !chooseUnitLink && dispatch(updateIsCareProviderModalOpen(false))
  }

  if (isLoadingUserStatistics) {
    return null
  }

  return (
    <ModalBaseLarge
      open={isCareProviderModalOpen}
      handleClose={handleClose}
      title={getModalTitle()}
      content={<CareProviderModalContent />}
      buttons={!chooseUnitLink && <CustomButton onClick={handleClose} buttonStyle="secondary" text="Avbryt" />}
      enableCross={!chooseUnitLink}
    />
  )
}

export default CareProviderModal
