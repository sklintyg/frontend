import * as React from 'react'
import { useEffect } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import {
  getActiveList,
  getActiveListConfig,
  getActiveListFilter,
  getIsLoadingListConfig,
  getListTotalCount,
  hasListError,
} from '../store/list/listSelectors'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getListConfig, performListSearch, updateActiveListType } from '../store/list/listActions'
import { CustomTooltip, ImageCentered } from '@frontend/common/src'
import { InfoBox, ListHeader } from '@frontend/common'
import noDraftsImage from '@frontend/common/src/images/no-drafts-image.svg'
import WebcertHeader from '../components/header/WebcertHeader'
import { withResourceAccess } from '../utils/withResourceAccess'
import { isFilterDefault } from '../feature/list/listUtils'
import { updateShouldRouteAfterDelete } from '../store/certificate/certificateActions'
import CertificateDeletedModal from '../feature/certificate/RemovedCertificate/CertificateDeletedModal'
import { getIsRoutedFromDeletedCertificate } from '../store/certificate/certificateSelectors'
import ReactTooltip from 'react-tooltip'
import { getNumberOfDraftsOnUnit, getNumberOfQuestionsOnUnit } from '../store/user/userSelectors'
import listImage from '@frontend/common/src/images/list.svg'
import letterImage from '@frontend/common/src/images/epost.svg'

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

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    dispatch(updateActiveListType(type))
    dispatch(getListConfig())
  }, [dispatch, type])

  useEffect(() => {
    if (!isLoadingListConfig && config) {
      dispatch(performListSearch)
    }
  }, [dispatch, config, isLoadingListConfig])

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
    } else {
      return letterImage
    }
  }

  const getList = () => {
    if (error) {
      return (
        <div className="iu-pt-300">
          <InfoBox type="error">Sökningen kunde inte utföras.</InfoBox>
        </div>
      )
    } else if (isListCompletelyEmpty()) {
      return (
        <ImageCentered imgSrc={noDraftsImage} alt={'Inga frågor'}>
          {config && <p>{config.emptyListText}</p>}
        </ImageCentered>
      )
    } else {
      return isLoadingListConfig ? (
        <></>
      ) : (
        <List
          icon={excludePageSpecificElements ? getIcon() : undefined}
          config={config}
          list={list}
          filter={filter}
          title={config?.secondaryTitle ? config.secondaryTitle : ''}
        />
      )
    }
  }

  return (
    <>
      {!excludePageSpecificElements && (
        <>
          <WebcertHeader />
          <CustomTooltip placement="top" />
          <CertificateDeletedModal routedFromDeletedCertificate={routedFromDeletedCertificate} />
          {!isLoadingListConfig && (
            <ListHeader
              icon={getIcon()}
              title={config?.title ? config.title : ''}
              description={config?.description ? config.description : ''}
            />
          )}
        </>
      )}
      <div className="ic-container">{getList()}</div>
    </>
  )
}

export const ListPageWithRedirect = withResourceAccess<Props>(ListPage)
export default ListPage
