import { epostImage, ListHeader, ListType, noDraftsImage, ResourceLinkType } from '@frontend/common'
import * as React from 'react'
import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import ListContainer from '../feature/list/ListContainer'
import {
  getActiveListConfig,
  getActiveListFilter,
  getHasUpdatedConfig,
  getIsLoadingListConfig,
  getListTotalCount,
} from '../store/list/listSelectors'

import ReactTooltip from 'react-tooltip'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { isFilterDefault } from '../feature/list/listUtils'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import { ResourceAccess } from '../utils/ResourceAccess'

const SignedCertificatesPage: React.FC = () => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const filter = useSelector(getActiveListFilter, shallowEqual)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const totalCount = useSelector(getListTotalCount)
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
    <ResourceAccess linkType={ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST}>
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
        }
      >
        <CertificateDeletedModal routedFromDeletedCertificate={routedFromDeletedCertificate} />
        <ListContainer
          type={ListType.CERTIFICATES}
          showMessageForEmptyList={isFilterDefault(config?.filters, filter?.values) && totalCount === 0}
          icon={undefined}
          emptyListIcon={noDraftsImage}
        />
      </CommonLayout>
    </ResourceAccess>
  )
}

export default SignedCertificatesPage
