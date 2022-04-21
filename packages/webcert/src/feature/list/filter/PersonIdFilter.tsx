import * as React from 'react'
import {
  ListFilterConfig,
  ListFilterType,
  ListFilterValue,
  ListFilterValuePersonId,
  ListFilterValueText,
} from '@frontend/common/src/types/list'
import { useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import PersonIdInput from '@frontend/common/src/components/Inputs/PatientIdInput'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const PersonIdFilter: React.FC<Props> = ({ config, onChange, isHighlighted }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValuePersonId

  const onPersonIdFilterChange = (formattedId: string) => {
    const value: ListFilterValuePersonId = {
      type: ListFilterType.PERSON_ID,
      value: formattedId,
    }
    onChange(value, config.id)
  }

  return (
    <FilterWrapper highlighted={isHighlighted}>
      <PersonIdInput
        onFormattedChange={onPersonIdFilterChange}
        value={value ? (value as ListFilterValueText).value : ''}
        label={config.title}
        id={config.id}
      />
    </FilterWrapper>
  )
}

export default PersonIdFilter
