import { isEqual } from 'lodash-es'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { CustomButton } from '../../components/Inputs/CustomButton'
import ModalBase from '../../components/utils/Modal/ModalBase'
import { useAppSelector } from '../../store/store'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import { getIsCareProviderModalOpen, getUserResourceLink, selectIsLoadingUserStatistics } from '../../store/user/userSelectors'
import { ResourceLinkType } from '../../types'
import { CareProviderModalContent } from './CareProviderModalContent'

const ModalBaseLarge = styled(ModalBase)`
  max-width: 55rem;
`

const CareProviderModal: React.FC = () => {
  const dispatch = useDispatch()
  const isLoadingUserStatistics = useSelector(selectIsLoadingUserStatistics, isEqual)
  const isCareProviderModalOpen = useSelector(getIsCareProviderModalOpen)
  const chooseUnitLink = useAppSelector(getUserResourceLink(ResourceLinkType.CHOOSE_UNIT))
  const changeUnitLink = useAppSelector(getUserResourceLink(ResourceLinkType.CHANGE_UNIT))

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
