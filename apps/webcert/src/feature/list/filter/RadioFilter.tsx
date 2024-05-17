import { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import RadioButton from '../../../components/Inputs/RadioButton'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { ListFilterRadioConfig, ListFilterType, ListFilterValue, ListFilterValueRadio } from '../../../types'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterRadioConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const RadioFilter: React.FC<Props> = ({ config, onChange, isHighlighted }) => {
  const val = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueRadio

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
