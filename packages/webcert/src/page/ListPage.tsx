import * as React from 'react'
import { useEffect } from 'react'
import { ListType } from '@frontend/common/src/types/list'
import { getActiveList, getActiveListConfig } from '../store/list/listSelectors'
import { useDispatch, useSelector } from 'react-redux'
import List from '../feature/list/List'
import { getDraftListConfig, getDrafts } from '../store/list/listActions'

interface Props {
  type: ListType
}

const ListPage: React.FC<Props> = ({ type }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig)
  const list = useSelector(getActiveList)

  useEffect(() => {
    if (type === ListType.DRAFTS) {
      dispatch(getDraftListConfig())
      dispatch(getDrafts())
    }
  })

  return (
    <>
      <List config={config} />
    </>
  )
}

export default ListPage
