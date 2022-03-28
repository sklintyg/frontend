import * as React from 'react'
import { CustomButton } from '@frontend/common/src/components'
import { useDispatch } from 'react-redux'
import { clearActiveListFilter, performListSearch } from '../../store/list/listActions'
import { ListFilterConfig } from '@frontend/common/src/types/list'

interface Props {
  searchTooltip: string
  filterConfig: ListFilterConfig[]
}

const ListFilterButtons: React.FC<Props> = ({ searchTooltip, filterConfig }) => {
  const dispatch = useDispatch()

  const onSearch = () => {
    dispatch(performListSearch())
  }

  const onReset = () => {
    dispatch(clearActiveListFilter(filterConfig))
  }

  return (
    <>
      <CustomButton buttonStyle="primary" text="Sök" tooltip={searchTooltip} onClick={onSearch} />
      <CustomButton buttonStyle="secondary" text="Återställ sökfiltret" tooltip="Rensa sökfiltret." onClick={onReset} />
    </>
  )
}

export default ListFilterButtons
