import * as React from 'react'
import { useEffect } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import { getActiveList, getActiveListConfig, getActiveListFilter, hasListError } from '../store/list/listSelectors'
import { useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getDraftListConfig, performListSearch } from '../store/list/listActions'
import { CustomTooltip } from '@frontend/common/src'
import { InfoBox } from '@frontend/common'

interface Props {
  type: ListType
}

const ListPage: React.FC<Props> = ({ type }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig)
  const list = useSelector(getActiveList)
  const filter = useSelector(getActiveListFilter)
  const error = useSelector(hasListError)

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
      dispatch(performListSearch)
    }
  }, [])

  return (
    <>
      <CustomTooltip />
      <div className={'ic-container'}>
        {error ? <InfoBox type="error">Sökningen kunde inte utföras.</InfoBox> : <List config={config} list={list} filter={filter} />}
      </div>
    </>
  )
}

export default ListPage
