import { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import RadioButton from '../../../components/Inputs/RadioButton'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { ListFilterRadioConfig, ListFilterType, ListFilterValue, ListFilterValueRadio, ListFilterValueSelect } from '../../../types'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterRadioConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const RadioFilter: React.FC<Props> = ({ config, onChange, isHighlighted }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueSelect

  const onFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: ListFilterValueSelect = {
      type: ListFilterType.RADIO,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  const getFilter = () => {
    return config.values.map((configValue, index) => (
      <RadioButton
        key={index}
        label={configValue.name}
        onChange={onFilterChange}
        id={configValue.id}
        value={configValue.id}
        checked={value && (value as ListFilterValueRadio).value === configValue.id}
      />
    ))
  }

  return (
    <FilterWrapper highlighted={isHighlighted} role="radiogroup" className="ic-radio-group-horizontal">
      {getFilter()}
    </FilterWrapper>
  )
}

export default RadioFilter
