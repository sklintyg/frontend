import type { ChangeEvent } from 'react'
import RadioButton from '../../../components/Inputs/RadioButton'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { useAppSelector } from '../../../store/store'
import type { ListFilterRadioConfig, ListFilterValue, ListFilterValueRadio } from '../../../types'
import { ListFilterType } from '../../../types'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterRadioConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const RadioFilter = ({ config, onChange, isHighlighted }: Props) => {
  const val = useAppSelector(getActiveListFilterValue(config.id)) as ListFilterValueRadio

  const onFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: ListFilterValueRadio = {
      type: ListFilterType.RADIO,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  return (
    <FilterWrapper highlighted={isHighlighted} role="radiogroup" className="ic-radio-group-horizontal">
      {config.values.map(({ id, name }) => (
        <RadioButton key={id} label={name} onChange={onFilterChange} id={id} value={id} checked={val && val.value === id} />
      ))}
    </FilterWrapper>
  )
}

export default RadioFilter
