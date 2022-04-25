import * as React from 'react'
import { useEffect } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import { getActiveList, getActiveListConfig, getActiveListFilter, getIsLoadingListConfig, hasListError } from '../store/list/listSelectors'
import { useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getDraftListConfig, performListSearch, updateActiveListType } from '../store/list/listActions'
import { CustomTooltip, ImageCentered } from '@frontend/common/src'
import { Backdrop, InfoBox, ListHeader } from '@frontend/common'
import noDraftsImage from '@frontend/common/src/images/no-drafts-image.svg'
import WebcertHeader from '../components/header/WebcertHeader'
import { withResourceAccess } from '../utils/withResourceAccess'
import { isFilterDefault } from '../feature/list/listUtils'
import { getNumberOfDraftsOnUnit } from '../store/utils/utilsSelectors'

interface Props {
  type: ListType
}

const ListPage: React.FC<Props> = ({ type }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig)
  const list = useSelector(getActiveList)
  const filter = useSelector(getActiveListFilter)
  const error = useSelector(hasListError)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const totalCount = useSelector(getListTotalCount)
  const nbrOfDraftsOnUnit = useSelector(getNumberOfDraftsOnUnit)

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
    } else if (type === ListType.CERTIFICATES) {
      dispatch(getCertificateListConfig())
    }
    dispatch(updateActiveListType(type))
  }, [dispatch, type])

  useEffect(() => {
    if (!isLoadingListConfig && config) {
      dispatch(performListSearch)
    }
  }, [config, isLoadingListConfig])

  const isListCompletelyEmpty = () => {
    if (type === ListType.DRAFTS) {
      return nbrOfDraftsOnUnit === 0 && false
    } else {
      const isFirstSearch = isFilterDefault(config?.filters, filter?.values)
      return isFirstSearch && totalCount === 0
    }
  }

  const getList = () => {
    if (error) {
      return <InfoBox type="error">Sökningen kunde inte utföras.</InfoBox>
    } else if (isListCompletelyEmpty()) {
      return (
        <ImageCentered imgSrc={noDraftsImage} alt={'Inga frågor'}>
          {config && <p>{config.emptyListText}</p>}
        </ImageCentered>
      )
    } else {
      return <List config={config} list={list} filter={filter} title={config?.secondaryTitle ? config.secondaryTitle : ''} />
    }
  }

  return (
    <Backdrop open={isLoadingListConfig} spinnerText="Laddar...">
      {!isLoadingListConfig && (
        <>
          <WebcertHeader />
          <CustomTooltip placement="top" />
          <ListHeader title={config?.title ? config.title : ''} description={config?.description ? config.description : ''} />
          <div className="ic-container">{getList()}</div>
        </>
      )}
    </Backdrop>
  )
}

export const ListPageWithRedirect = withResourceAccess<Props>(ListPage)
