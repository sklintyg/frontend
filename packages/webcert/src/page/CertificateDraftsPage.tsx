import { ListHeader } from '@frontend/common/src'
import { ListType } from '@frontend/common/src/types/list'
import * as React from 'react'
import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getActiveListConfig, getHasUpdatedConfig, getIsLoadingListConfig } from '../store/list/listSelectors'
import ListContainer from '../feature/list/ListContainer'
import letterImage from '@frontend/common/src/images/epost.svg'
import noDraftsImage from '@frontend/common/src/images/no-drafts-image.svg'
import ReactTooltip from 'react-tooltip'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import { getNumberOfDraftsOnUnit } from '../store/user/userSelectors'

/**
 * Page for certificate drafts containing a list with filter options, sorting etc..
 */
const CertificateDraftPage: React.FC = () => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const nbrOfDraftsOnUnit = useSelector(getNumberOfDraftsOnUnit)
  const routedFromDeletedCertificate = useSelector(getIsRoutedFromDeletedCertificate())
  const hasUpdatedConfig = useSelector(getHasUpdatedConfig)

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  return (
    <CommonLayout
      header={
        <>
          <WebcertHeader />
          {(!isLoadingListConfig || hasUpdatedConfig) && (
            <ListHeader
              icon={letterImage}
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
  )
}

export default CertificateDraftPage
