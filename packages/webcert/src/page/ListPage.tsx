import * as React from 'react'
import { useEffect } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import { getActiveList, getActiveListConfig, getActiveListFilter } from '../store/list/listSelectors'
import { useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getDraftListConfig } from '../store/list/listActions'
import { CustomTooltip } from '@frontend/common/src'

interface Props {
  type: ListType
}

const ListPage: React.FC<Props> = ({ type }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig)
  const list = useSelector(getActiveList)
  const filter = useSelector(getActiveListFilter)

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
    }
  }, [])

  return (
    <>
      <CustomTooltip />
      <div className={'ic-container'}>
        <List config={config} list={list} filter={filter} />
      </div>
    </>
  )
}

export default ListPage
