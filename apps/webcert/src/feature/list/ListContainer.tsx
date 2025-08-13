import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'
import ImageCentered from '../../components/image/image/ImageCentered'
import { updateShouldRouteAfterDelete } from '../../store/certificate/certificateActions'
import { getListConfig, updateActiveListType } from '../../store/list/listActions'
import {
  getActiveList,
  getActiveListConfig,
  getActiveListFilter,
  getActiveListType,
  getHasUpdatedConfig,
  getIsLoadingListConfig,
} from '../../store/list/listSelectors'
import { getActivePatient } from '../../store/patient/patientSelectors'
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
  const listType = useAppSelector(getActiveListType)
  const patient = useAppSelector(getActivePatient)

  useEffect(() => {
    if (listType !== type) {
      dispatch(updateActiveListType(type))
    }
  }, [dispatch, listType, type])

  useEffect(() => {
    if (listType === type && loggedInUnit?.unitId && config == null) {
      dispatch(getListConfig())
    }
  }, [dispatch, type, loggedInUnit, isLoadingListConfig, config, listType, patient])

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
