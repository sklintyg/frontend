import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import ListHeader from '../components/List/ListHeader'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import ListContainer from '../feature/list/ListContainer'
import { noQuestionImage, speechBubbleImage } from '../images'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getActiveListConfig, getHasUpdatedConfig, getIsLoadingListConfig } from '../store/list/listSelectors'
import { useAppDispatch, useAppSelector } from '../store/store'
import { getNumberOfQuestionsOnUnit } from '../store/user/userSelectors'
import { ListType, ResourceLinkType } from '../types'
import { ResourceAccess } from '../utils/ResourceAccess'

const UnhandledCertificatsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const config = useAppSelector(getActiveListConfig, shallowEqual)
  const isLoadingListConfig = useAppSelector(getIsLoadingListConfig)
  const nbrOfQuestionsOnUnit = useAppSelector(getNumberOfQuestionsOnUnit)

  const hasUpdatedConfig = useAppSelector(getHasUpdatedConfig)

  useEffect(() => {
    ReactTooltip.rebuild()
    dispatch(resetCertificateState())
  })

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  return (
    <ResourceAccess linkType={ResourceLinkType.ACCESS_QUESTION_LIST}>
      <CommonLayout
        header={
          <>
            <WebcertHeader />
            {(!isLoadingListConfig || hasUpdatedConfig) && (
              <ListHeader
                icon={speechBubbleImage}
                title={config?.title ? config.title : ''}
                description={config?.description ? config.description : ''}
              />
            )}
          </>
        }
      >
        <ListContainer
          type={ListType.UNHANDLED_CERTIFICATES}
          showMessageForEmptyList={nbrOfQuestionsOnUnit === 0}
          icon={undefined}
          emptyListIcon={noQuestionImage}
        />
      </CommonLayout>
    </ResourceAccess>
  )
}

export default UnhandledCertificatsPage
