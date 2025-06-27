import type { ChangeEvent } from 'react'
import TextInput from '../../../components/Inputs/TextInput'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { useAppSelector } from '../../../store/store'
import type { ListFilterConfig, ListFilterValue, ListFilterValueText } from '../../../types'
import { ListFilterType } from '../../../types'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const ListFilterComponent = ({ config, onChange, isHighlighted }: Props) => {
  const value = useAppSelector(getActiveListFilterValue(config.id)) as ListFilterValue

  const onTextFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: ListFilterValueText = {
      type: ListFilterType.TEXT,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  return (
    <FilterWrapper highlighted={isHighlighted}>
      <TextInput
        onChange={onTextFilterChange}
        value={value ? (value as ListFilterValueText).value : ''}
        label={config.title}
        id={config.id}
      />
    </FilterWrapper>
  )
}

export default ListFilterComponent
