import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PersonIdInput from '../../../components/Inputs/PersonIdInput'
import { updateValidationError } from '../../../store/list/listActions'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import type { ListFilterConfig, ListFilterValue, ListFilterValuePersonId } from '../../../types'
import { ListFilterType } from '../../../types'
import { isPersonIdValid } from '../../../utils'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const PersonIdFilter = ({ config, onChange, isHighlighted }: Props) => {
  const filterValue = useSelector(getActiveListFilterValue(config.id)) as ListFilterValuePersonId
  const [personId, setPersonId] = useState<string>(filterValue ? filterValue.value : '')
  const dispatch = useDispatch()

  useEffect(() => {
    setPersonId(filterValue ? filterValue.value : '')
  }, [filterValue])

  const onPersonIdFilterChange = (formattedId: string) => {
    if (formattedId === '' || isPersonIdValid(formattedId)) {
      const value: ListFilterValuePersonId = {
        type: ListFilterType.PERSON_ID,
        value: formattedId,
      }
      onChange(value, config.id)
      dispatch(updateValidationError({ id: config.id, value: false }))
    } else {
      dispatch(updateValidationError({ id: config.id, value: true }))
    }
    setPersonId(formattedId)
  }

  return (
    <FilterWrapper highlighted={isHighlighted}>
      <PersonIdInput onFormattedChange={onPersonIdFilterChange} value={personId} label={config.title} id={config.id} />
    </FilterWrapper>
  )
}

export default PersonIdFilter
