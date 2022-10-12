import { ListHeader } from '@frontend/common/src'
import { ListType } from '@frontend/common/src/types/list'
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

import letterImage from '@frontend/common/src/images/epost.svg'
import noDraftsImage from '@frontend/common/src/images/no-drafts-image.svg'
import ReactTooltip from 'react-tooltip'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { isFilterDefault } from '../feature/list/listUtils'
import { updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'

/**
 * Page for signed certificates containing a list with filter options, sorting etc.
 */
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
        type={ListType.CERTIFICATES}
        showMessageForEmptyList={isFilterDefault(config?.filters, filter?.values) && totalCount === 0}
        icon={undefined}
        emptyListIcon={noDraftsImage}
      />
    </CommonLayout>
  )
}

export default SignedCertificatesPage
