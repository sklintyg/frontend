import * as React from 'react'
import { useEffect } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import { getActiveList, getActiveListConfig, getActiveListFilter, getIsLoadingListConfig, hasListError } from '../store/list/listSelectors'
import { useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getDraftListConfig, performListSearch } from '../store/list/listActions'
import { CustomTooltip, ImageCentered } from '@frontend/common/src'
import { Backdrop, InfoBox, ListHeader } from '@frontend/common'
import { getNumberOfDraftsOnUnit } from '../store/utils/utilsSelectors'
import noDraftsImage from '@frontend/common/src/images/no-drafts-image.svg'
import WebcertHeader from '../components/header/WebcertHeader'
import { withResourceAccess } from '../utils/withResourceAccess'

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
  const nbrOfDraftsOnUnit = useSelector(getNumberOfDraftsOnUnit)

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
    }
    dispatch(updateActiveListType(type))
  }, [])

  useEffect(() => {
    if (!isLoadingListConfig && config) {
      dispatch(performListSearch)
    }
  }, [config, isLoadingListConfig])

  const getList = () => {
    if (error) {
      return <InfoBox type="error">Sökningen kunde inte utföras.</InfoBox>
    } else if (nbrOfDraftsOnUnit === 0 && false) {
      return (
        <ImageCentered imgSrc={noDraftsImage} alt={'Inga frågor'}>
          <p>{config?.emptyListText}</p>
        </ImageCentered>
      )
    } else {
      return <List config={config} list={list} filter={filter} title={config?.secondaryTitle} />
    }
  }

  return (
    <Backdrop open={isLoadingListConfig} spinnerText="Laddar...">
      {!isLoadingListConfig && (
        <>
          <WebcertHeader />
          <CustomTooltip />
          <ListHeader title={config?.title} description={config?.description} />
          <div className={'ic-container'}>{getList()}</div>
        </>
      )}
    </Backdrop>
  )
}

export const ListPageWithRedirect = withResourceAccess<Props>(ListPage)
