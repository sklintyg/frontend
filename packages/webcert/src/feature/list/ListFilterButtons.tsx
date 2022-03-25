import * as React from 'react'
import { CustomButton } from '@frontend/common/src/components'
import { useDispatch } from 'react-redux'
import { clearActiveListFilter, performListSearch } from '../../store/list/listActions'

interface Props {
  searchTooltip: string
}

const ListFilterButtons: React.FC<Props> = ({ searchTooltip }) => {
  const dispatch = useDispatch()

  const onSearch = () => {
    dispatch(performListSearch())
  }

  const onReset = () => {
    dispatch(clearActiveListFilter) //should order be reset?
  }

  return (
    <>
      <CustomButton buttonStyle="primary" text="Sök" tooltip={searchTooltip} onClick={onSearch} />
      <CustomButton buttonStyle="secondary" text="Återställ sökfiltret" tooltip="Rensa sökfiltret." onClick={onReset} />
    </>
  )
}

export default ListFilterButtons
