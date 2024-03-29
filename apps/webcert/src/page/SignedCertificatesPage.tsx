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
import { isFilterDefault } from '../feature/list/listUtils'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { ResourceAccess } from '../utils/ResourceAccess'
import ListHeader from '../components/List/ListHeader'
import { epostImage, noDraftsImage } from '../images'
import { ResourceLinkType, ListType } from '../types'

const SignedCertificatesPage: React.FC = () => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const filter = useSelector(getActiveListFilter, shallowEqual)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const totalCount = useSelector(getListTotalCount)
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
