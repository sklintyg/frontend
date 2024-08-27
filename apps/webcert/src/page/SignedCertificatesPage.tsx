import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'
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
import ListHeader from '../components/List/ListHeader'
import { isFilterDefault } from '../feature/list/listUtils'
import { epostImage, noDraftsImage } from '../images'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { useAppDispatch, useAppSelector } from '../store/store'
import { ListType, ResourceLinkType } from '../types'
import { ResourceAccess } from '../utils/ResourceAccess'

const SignedCertificatesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const config = useAppSelector(getActiveListConfig, shallowEqual)
  const filter = useAppSelector(getActiveListFilter, shallowEqual)
  const isLoadingListConfig = useAppSelector(getIsLoadingListConfig)
  const totalCount = useAppSelector(getListTotalCount)
  const hasUpdatedConfig = useAppSelector(getHasUpdatedConfig)

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
