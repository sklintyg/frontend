import { ImageCentered, InfoBox, ListHeader } from '@frontend/common/src'
import { ListType } from '@frontend/common/src/types/list'
import * as React from 'react'
import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getListConfig, performListSearch, updateActiveListType, updateListConfig } from '../store/list/listActions'
import {
  getActiveList,
  getActiveListConfig,
  getActiveListFilter,
  getHasUpdatedConfig,
  getIsLoadingListConfig,
  getListTotalCount,
  hasListError,
} from '../store/list/listSelectors'

import letterImage from '@frontend/common/src/images/epost.svg'
import listImage from '@frontend/common/src/images/list.svg'
import noDraftsImage from '@frontend/common/src/images/no-drafts-image.svg'
import noQuestionsImage from '@frontend/common/src/images/no-questions-image.svg'
import questionImage from '@frontend/common/src/images/speech-bubble.svg'
import ReactTooltip from 'react-tooltip'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { isFilterDefault } from '../feature/list/listUtils'
import { updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import { getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import { getNumberOfDraftsOnUnit, getNumberOfQuestionsOnUnit } from '../store/user/userSelectors'
import { withResourceAccess } from '../utils/withResourceAccess'

interface Props {
  type: ListType
  excludePageSpecificElements?: boolean
}

const ListPage: React.FC<Props> = ({ type, excludePageSpecificElements }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const list = useSelector(getActiveList, shallowEqual)
  const filter = useSelector(getActiveListFilter, shallowEqual)
  const error = useSelector(hasListError)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const totalCount = useSelector(getListTotalCount)
  const nbrOfDraftsOnUnit = useSelector(getNumberOfDraftsOnUnit)
  const nbrOfQuestionsOnUnit = useSelector(getNumberOfQuestionsOnUnit)
  const routedFromDeletedCertificate = useSelector(getIsRoutedFromDeletedCertificate())
  const hasUpdatedConfig = useSelector(getHasUpdatedConfig)

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    if (hasUpdatedConfig) {
      dispatch(updateListConfig())
    }
  }, [dispatch, hasUpdatedConfig])

  useEffect(() => {
    dispatch(updateActiveListType(type))
    dispatch(getListConfig())
  }, [dispatch, type])

  useEffect(() => {
    if (!isLoadingListConfig && config && !hasUpdatedConfig) {
      dispatch(performListSearch)
    }
  }, [dispatch, config, isLoadingListConfig, hasUpdatedConfig])

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  const isListCompletelyEmpty = () => {
    if (type === ListType.DRAFTS) {
      return nbrOfDraftsOnUnit === 0
    } else if (type === ListType.QUESTIONS) {
      return nbrOfQuestionsOnUnit === 0
    } else {
      const isFirstSearch = isFilterDefault(config?.filters, filter?.values)
      return isFirstSearch && totalCount === 0
    }
  }

  const getIcon = () => {
    if (type === ListType.PREVIOUS_CERTIFICATES) {
      return listImage
    } else if (type === ListType.QUESTIONS) {
      return questionImage
    } else {
      return letterImage
    }
  }

  const getEmptyListIcon = () => {
    if (type === ListType.QUESTIONS) {
      return noQuestionsImage
    } else {
      return noDraftsImage
    }
  }

  const getList = () => {
    if (error) {
      return <InfoBox type="error">Sökningen kunde inte utföras.</InfoBox>
    } else if (isListCompletelyEmpty()) {
      return (
        <ImageCentered imgSrc={getEmptyListIcon()} alt="Det finns inga resultat i listan.">
          {config && <p>{config.emptyListText}</p>}
        </ImageCentered>
      )
    } else {
      return isLoadingListConfig && !hasUpdatedConfig ? null : (
        <List
          icon={excludePageSpecificElements ? getIcon() : undefined}
          config={config}
          list={list}
          filter={filter}
          title={config?.secondaryTitle ? config.secondaryTitle : ''}
          type={type}
        />
      )
    }
  }

  if (excludePageSpecificElements) {
    return getList()
  }

  return (
    <CommonLayout
      header={
        <>
          <WebcertHeader />
          {(!isLoadingListConfig || hasUpdatedConfig) && (
            <ListHeader
              icon={getIcon()}
              title={config?.title ? config.title : ''}
              description={config?.description ? config.description : ''}
            />
          )}
        </>
      }>
      <CertificateDeletedModal routedFromDeletedCertificate={routedFromDeletedCertificate} />
      {getList()}
    </CommonLayout>
  )
}

export const ListPageWithRedirect = withResourceAccess<Props>(ListPage)
export default ListPage
