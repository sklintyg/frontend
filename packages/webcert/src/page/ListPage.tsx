import * as React from 'react'
import { useEffect } from 'react'
import { ListDraftFilter, ListType } from '@frontend/common/src/types/list'
import { getActiveList, getActiveListConfig, getActiveListFilter } from '../store/list/listSelectors'
import { useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getDraftListConfig, getDrafts } from '../store/list/listActions'
import { CustomTooltip } from '@frontend/common/src'

interface Props {
  type: ListType
}

const ListPage: React.FC<Props> = ({ type }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig)
  const list = useSelector(getActiveList)
  const filter = useSelector(getActiveListFilter)

  const exampleFilter: ListDraftFilter = {
    ascending: false,
    forwarded: false,
    orderBy: 'FORWARDED',
    pageSize: 10,
    patientId: '',
    savedByHsaID: '',
    savedFrom: undefined,
    savedTo: undefined,
    startFrom: 0,
    status: undefined,
  }

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
      dispatch(getDrafts(exampleFilter))
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
