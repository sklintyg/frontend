import { epostImage, ListHeader, ListType, noDraftsImage, ResourceLinkType } from '@frontend/common'
import * as React from 'react'
import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import ListContainer from '../feature/list/ListContainer'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import { getActiveListConfig, getHasUpdatedConfig, getIsLoadingListConfig } from '../store/list/listSelectors'
import { getNumberOfDraftsOnUnit } from '../store/user/userSelectors'
import { ResourceAccess } from '../utils/ResourceAccess'

const CertificateDraftPage: React.FC = () => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const nbrOfDraftsOnUnit = useSelector(getNumberOfDraftsOnUnit)
  const routedFromDeletedCertificate = useSelector(getIsRoutedFromDeletedCertificate())
  const hasUpdatedConfig = useSelector(getHasUpdatedConfig)

  useEffect(() => {
    ReactTooltip.rebuild()
    dispatch(resetCertificateState())
  })

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  return (
    <ResourceAccess linkType={ResourceLinkType.ACCESS_DRAFT_LIST}>
      <CommonLayout
        header={
          <>
            <WebcertHeader />
            {(!isLoadingListConfig || hasUpdatedConfig) && (
              <ListHeader
                icon={epostImage}
                title={config?.title ? config.title : ''}
                description={config?.description ? config.description : ''}
              />
            )}
          </>
        }>
        <CertificateDeletedModal routedFromDeletedCertificate={routedFromDeletedCertificate} />
        <ListContainer
          type={ListType.DRAFTS}
          showMessageForEmptyList={nbrOfDraftsOnUnit === 0}
          icon={undefined}
          emptyListIcon={noDraftsImage}
        />
      </CommonLayout>
    </ResourceAccess>
  )
}

export default CertificateDraftPage