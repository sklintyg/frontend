import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import ListContainer from '../feature/list/ListContainer'
import { resetCertificateState, updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getActiveListConfig, getHasUpdatedConfig, getIsLoadingListConfig } from '../store/list/listSelectors'
import { getNumberOfQuestionsOnUnit } from '../store/user/userSelectors'
import { ResourceAccess } from '../utils/ResourceAccess'
import ListHeader from '../components/List/ListHeader'
import { speechBubbleImage, noQuestionImage } from '../images'
import { ResourceLinkType, ListType } from '../types'

const UnhandledCertificatsPage: React.FC = () => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const nbrOfQuestionsOnUnit = useSelector(getNumberOfQuestionsOnUnit)

  const hasUpdatedConfig = useSelector(getHasUpdatedConfig)

  useEffect(() => {
    ReactTooltip.rebuild()
    dispatch(resetCertificateState())
  })

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  return (
    <ResourceAccess linkType={ResourceLinkType.ACCESS_UNHANDLED_CERTIFICATES}>
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
