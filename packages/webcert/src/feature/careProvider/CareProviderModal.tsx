import { PopUpModal } from '@frontend/common'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateIsCareProviderModalOpen } from '../../store/user/userActions'
import { getUser, selectIsLoadingUserStatistics, getIsCareProviderModalOpen } from '../../store/user/userSelectors'
import { CareProviderModalContent } from './CareProviderModalContent'

const CareProviderModal: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const isLoadingUserStatistics = useSelector(selectIsLoadingUserStatistics, _.isEqual)
  const isCareProviderModalOpen = useSelector(getIsCareProviderModalOpen)

  useEffect(() => {
    if (!!user && !user?.loggedInUnit.unitId) {
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
    <PopUpModal
      modalTitle="Välj vårdgivare"
      open={isCareProviderModalOpen}
      handleClose={handleClose}
      showCloseButton={!!user?.loggedInUnit.unitId}>
      <CareProviderModalContent />
    </PopUpModal>
  )
}

export default CareProviderModal
