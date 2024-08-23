import { isEqual } from 'lodash-es'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { CustomButton } from '../../components/Inputs/CustomButton'
import ModalBase from '../../components/utils/Modal/ModalBase'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import {
  getIsCareProviderModalOpen,
  getSelectUnitHeading,
  getUserResourceLink,
  selectIsLoadingUserStatistics,
} from '../../store/user/userSelectors'
import { ResourceLinkType } from '../../types'
import { CareProviderModalContent } from './CareProviderModalContent'

const ModalBaseLarge = styled(ModalBase)`
  max-width: 55rem;
`

const CareProviderModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const isLoadingUserStatistics = useAppSelector(selectIsLoadingUserStatistics, isEqual)
  const isCareProviderModalOpen = useAppSelector(getIsCareProviderModalOpen)
  const hasChooseUnitLink = useAppSelector((state) => Boolean(getUserResourceLink(ResourceLinkType.CHOOSE_UNIT)(state)))
  const modalTitle = useAppSelector(getSelectUnitHeading)

  useEffect(() => {
    if (hasChooseUnitLink) {
      dispatch(updateIsCareProviderModalOpen(true))
    }
  })

  const handleClose = () => {
    !hasChooseUnitLink && dispatch(updateIsCareProviderModalOpen(false))
  }

  if (isLoadingUserStatistics) {
    return null
  }

  return (
    <ModalBaseLarge
      open={isCareProviderModalOpen}
      handleClose={handleClose}
      title={modalTitle}
      content={<CareProviderModalContent />}
      buttons={!hasChooseUnitLink && <CustomButton onClick={handleClose} buttonStyle="secondary" text="Avbryt" />}
      enableCross={!hasChooseUnitLink}
    />
  )
}

export default CareProviderModal
