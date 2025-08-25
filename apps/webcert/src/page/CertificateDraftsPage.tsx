import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import ListHeader from '../components/List/ListHeader'
import { ListContainer } from '../feature/list/ListContainer'
import { epostImage, noDraftsImage } from '../images'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getActiveListConfig, getHasUpdatedConfig, getIsLoadingListConfig, getListError } from '../store/list/listSelectors'
import { useAppDispatch, useAppSelector } from '../store/store'
import { getNumberOfDraftsOnUnit } from '../store/user/userSelectors'
import { ListType, ResourceLinkType } from '../types'
import { ResourceAccess } from '../utils/ResourceAccess'

export function CertificateDraftsPage() {
  const dispatch = useAppDispatch()
  const config = useAppSelector(getActiveListConfig, shallowEqual)
  const isLoadingListConfig = useAppSelector(getIsLoadingListConfig)
  const nbrOfDraftsOnUnit = useAppSelector(getNumberOfDraftsOnUnit)
  const hasUpdatedConfig = useAppSelector(getHasUpdatedConfig)
  const listError = useAppSelector(getListError)

  useEffect(() => {
    dispatch(resetCertificateState())
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
        }
      >
        <ListContainer
          type={ListType.DRAFTS}
          showMessageForEmptyList={!listError && nbrOfDraftsOnUnit === 0}
          icon={undefined}
          emptyListIcon={noDraftsImage}
        />
      </CommonLayout>
    </ResourceAccess>
  )
}
