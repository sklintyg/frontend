import { PopUpModal, ResourceLinkType } from '@frontend/common'
import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { getUserResourceLinks, selectIsLoadingUserStatistics } from '../../store/user/userSelectors'
import { CareProviderModalContent } from './CareProviderModalContent'

const CareProviderModal: React.FC = () => {
  const isLoadingUserStatistics = useSelector(selectIsLoadingUserStatistics, _.isEqual)
  const userLinks = useSelector(getUserResourceLinks)
  const chooseUnitLink = userLinks?.find((link) => link.type === ResourceLinkType.CHOOSE_UNIT)

  if (isLoadingUserStatistics) {
    return null
  }

  return (
    <PopUpModal modalTitle="Välj vårdgivare" open={!!chooseUnitLink}>
      <CareProviderModalContent />
    </PopUpModal>
  )
}

export default CareProviderModal
