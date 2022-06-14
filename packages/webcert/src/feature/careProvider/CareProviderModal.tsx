import { PopUpModal, ResourceLinkType } from '@frontend/common'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import { getUser, selectIsLoadingUserStatistics, getIsCareProviderModalOpen, getUserResourceLinks } from '../../store/user/userSelectors'
import { CareProviderModalContent } from './CareProviderModalContent'

const CareProviderModal: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
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
    dispatch(updateIsCareProviderModalOpen(false))
  }

  if (isLoadingUserStatistics) {
    return null
  }

  return (
    <PopUpModal modalTitle={getModalTitle()} open={isCareProviderModalOpen} handleClose={handleClose} showCloseButton={!chooseUnitLink}>
      <CareProviderModalContent />
    </PopUpModal>
  )
}

export default CareProviderModal
