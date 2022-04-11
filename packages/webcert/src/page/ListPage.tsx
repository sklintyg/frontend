import * as React from 'react'
import { useEffect } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import {
  getActiveList,
  getActiveListConfig,
  getActiveListFilter,
  getIsLoadingList,
  getIsLoadingListConfig,
  getListTotalCount,
  hasListError,
} from '../store/list/listSelectors'
import { useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getDraftListConfig, performListSearch } from '../store/list/listActions'
import { CustomTooltip } from '@frontend/common/src'
import { Backdrop, InfoBox } from '@frontend/common'

interface Props {
  type: ListType
}

const ListPage: React.FC<Props> = ({ type }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig)
  const list = useSelector(getActiveList)
  const filter = useSelector(getActiveListFilter)
  const error = useSelector(hasListError)
  const totalCount = useSelector(getListTotalCount)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const isLoadingList = useSelector(getIsLoadingList)

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
    }
  }, [])

  useEffect(() => {
    if (!isLoadingListConfig && config) {
      dispatch(performListSearch)
    }
  }, [config, isLoadingListConfig])

  const getList = () => {
    if (error) {
      return <InfoBox type="error">Sökningen kunde inte utföras.</InfoBox>
    } else if (totalCount === 0 && !isLoadingList) {
      return <p>Det finns inga ej signerade utkast för den enhet du är inloggad på.</p>
    } else {
      return <List config={config} list={list} filter={filter} />
    }
  }

  return (
    <Backdrop open={isLoadingListConfig} spinnerText="Laddar...">
      <CustomTooltip />
      <div className={'ic-container'}>{getList()}</div>
    </Backdrop>
  )
}

export default ListPage
