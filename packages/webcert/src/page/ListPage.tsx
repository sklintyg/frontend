import * as React from 'react'
import { useEffect, useState } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import { getActiveList, getActiveListConfig, getActiveListFilter, hasListError } from '../store/list/listSelectors'
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
  const [loadingPage, setLoadingPage] = useState(true)

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
    }
  }, [])

  useEffect(() => {
    if (config) {
      setLoadingPage(false)
      dispatch(performListSearch)
    } else {
      setLoadingPage(true)
    }
  }, [config])

  return (
    <Backdrop open={loadingPage}>
      <CustomTooltip />
      <div className={'ic-container'}>
        {error ? <InfoBox type="error">Sökningen kunde inte utföras.</InfoBox> : <List config={config} list={list} filter={filter} />}
      </div>
    </Backdrop>
  )
}

export default ListPage
