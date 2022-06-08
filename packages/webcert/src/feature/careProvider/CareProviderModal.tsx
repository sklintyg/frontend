import { PopUpModal } from '@frontend/common'
import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { getUser, selectIsLoadingUserStatistics } from '../../store/user/userSelectors'
import { CareProviderModalContent } from './CareProviderModalContent'

const CareProviderModal: React.FC = () => {
  const user = useSelector(getUser)
  const isLoadingUserStatistics = useSelector(selectIsLoadingUserStatistics, _.isEqual)

  const showCareProviderModal = !!user && !user?.loggedInUnit.unitId

  if (isLoadingUserStatistics) {
    return null
  }

  return (
    <PopUpModal modalTitle="Välj vårdgivare" open={showCareProviderModal}>
      <CareProviderModalContent />
    </PopUpModal>
  )
}

export default CareProviderModal
