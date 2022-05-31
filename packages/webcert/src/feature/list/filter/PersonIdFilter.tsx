import * as React from 'react'
import { useEffect, useState } from 'react'
import { ListFilterConfig, ListFilterType, ListFilterValue, ListFilterValuePersonId } from '@frontend/common/src/types/list'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import PersonIdInput from '@frontend/common/src/components/Inputs/PersonIdInput'
import { FilterWrapper } from './filterStyles'
import { isPersonIdValid } from '@frontend/common/src/utils/personIdValidatorUtils'
import { updateValidationError } from '../../../store/list/listActions'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const PersonIdFilter: React.FC<Props> = ({ config, onChange, isHighlighted }) => {
  const filterValue = useSelector(getActiveListFilterValue(config.id)) as ListFilterValuePersonId
  const [personId, setPersonId] = useState<string>(filterValue.value)
  const dispatch = useDispatch()

  useEffect(() => {
    setPersonId(filterValue.value)
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
