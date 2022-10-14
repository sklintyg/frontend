import { ListHeader } from '@frontend/common/src'
import { ListType } from '@frontend/common/src/types/list'
import * as React from 'react'
import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import ListContainer from '../feature/list/ListContainer'
import { getActiveListConfig, getHasUpdatedConfig, getIsLoadingListConfig } from '../store/list/listSelectors'
import noQuestionsImage from '@frontend/common/src/images/no-questions-image.svg'
import questionImage from '@frontend/common/src/images/speech-bubble.svg'
import ReactTooltip from 'react-tooltip'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import { getNumberOfQuestionsOnUnit } from '../store/user/userSelectors'

/**
 * Page for unhandled certificates containing a list with filter options, sorting etc.
 */
const UnhandledCertificatsPage: React.FC = () => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const nbrOfQuestionsOnUnit = useSelector(getNumberOfQuestionsOnUnit)
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
              icon={questionImage}
              title={config?.title ? config.title : ''}
              description={config?.description ? config.description : ''}
            />
          )}
        </>
      }>
      <CertificateDeletedModal routedFromDeletedCertificate={routedFromDeletedCertificate} />
      <ListContainer
        type={ListType.UNHANDLED_CERTIFICATES}
        showMessageForEmptyList={nbrOfQuestionsOnUnit === 0}
        icon={undefined}
        emptyListIcon={noQuestionsImage}
      />
    </CommonLayout>
  )
}

export default UnhandledCertificatsPage
