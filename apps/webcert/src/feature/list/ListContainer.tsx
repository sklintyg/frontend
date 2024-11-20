import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import ImageCentered from '../../components/image/image/ImageCentered'
import { updateShouldRouteAfterDelete } from '../../store/certificate/certificateActions'
import { getListConfig, updateActiveListType, updateListConfig } from '../../store/list/listActions'
import {
  getActiveList,
  getActiveListConfig,
  getActiveListFilter,
  getHasUpdatedConfig,
  getIsLoadingListConfig,
} from '../../store/list/listSelectors'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getLoggedInUnit } from '../../store/user/userSelectors'
import type { ListType } from '../../types'
import { List } from './List'

export function ListContainer({
  type,
  showMessageForEmptyList,
  icon,
  emptyListIcon,
}: Readonly<{
  type: ListType
  showMessageForEmptyList: boolean
  icon?: string
  emptyListIcon: string
}>) {
  const dispatch = useAppDispatch()
  const config = useAppSelector(getActiveListConfig, shallowEqual)
  const list = useAppSelector(getActiveList, shallowEqual)
  const filter = useAppSelector(getActiveListFilter, shallowEqual)
  const isLoadingListConfig = useAppSelector(getIsLoadingListConfig)
  const hasUpdatedConfig = useAppSelector(getHasUpdatedConfig)
  const loggedInUnit = useAppSelector(getLoggedInUnit)

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
    if (loggedInUnit?.unitId) {
      dispatch(getListConfig())
    }
  }, [dispatch, type, loggedInUnit])

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  if (showMessageForEmptyList) {
    return (
      <ImageCentered imgSrc={emptyListIcon} alt="Det finns inga resultat i listan.">
        {config && <p>{config.emptyListText}</p>}
      </ImageCentered>
    )
  } else {
    return isLoadingListConfig && !hasUpdatedConfig ? null : (
      <List
        icon={icon}
        config={config}
        list={list}
        filter={filter}
        title={config?.secondaryTitle ? config.secondaryTitle : ''}
        type={type}
      />
    )
  }
}
