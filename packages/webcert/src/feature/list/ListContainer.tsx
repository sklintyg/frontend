import { ImageCentered, InfoBox, ListType } from '@frontend/common'
import * as React from 'react'
import { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import DisplayError from '../../components/error/DisplayError'
import { updateShouldRouteAfterDelete } from '../../store/certificate/certificateActions'
import { getListConfig, performListSearch, updateActiveListType, updateListConfig } from '../../store/list/listActions'
import {
  getActiveList,
  getActiveListConfig,
  getActiveListFilter,
  getHasUpdatedConfig,
  getIsLoadingListConfig,
  getListError,
} from '../../store/list/listSelectors'
import { getLoggedInUnit } from '../../store/user/userSelectors'
import List from './List'

interface Props {
  /** Determine what should be dispatch. */
  type: ListType
  /** Set if list is empty. */
  showMessageForEmptyList: boolean
  /** Link to optional icon to display. */
  icon?: string
  /** Link to what icon should be displayed if list is empty. */
  emptyListIcon: string
}

/**
 * Returns a list with filter options, sorting etc. Page components is based on provided configuration.
 */
const ListContainer: React.FC<Props> = ({ type, showMessageForEmptyList, icon, emptyListIcon }) => {
  const dispatch = useDispatch()
  const config = useSelector(getActiveListConfig, shallowEqual)
  const list = useSelector(getActiveList, shallowEqual)
  const filter = useSelector(getActiveListFilter, shallowEqual)
  const listError = useSelector(getListError)
  const isLoadingListConfig = useSelector(getIsLoadingListConfig)
  const hasUpdatedConfig = useSelector(getHasUpdatedConfig)
  const loggedInUnit = useSelector(getLoggedInUnit)

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    dispatch(updateActiveListType(type))
    if (loggedInUnit?.unitId) {
      dispatch(getListConfig())
    }
  }, [dispatch, type, loggedInUnit])

  useEffect(() => {
    if (!isLoadingListConfig && config && !hasUpdatedConfig) {
      dispatch(performListSearch)
    } else if (!isLoadingListConfig) {
      dispatch(updateListConfig())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, config, isLoadingListConfig])

  useEffect(() => {
    dispatch(updateShouldRouteAfterDelete(true))
  })

  const getList = () => {
    if (listError) {
      return (
        <InfoBox type="error">
          <DisplayError errorCode={listError?.errorCode} fallback="Sökningen kunde inte utföras." />
        </InfoBox>
      )
    } else if (showMessageForEmptyList) {
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

  return <>{getList()}</>
}

export default ListContainer
