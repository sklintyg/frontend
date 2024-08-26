import type { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { updateActiveListFilterValue } from '../../store/list/listActions'
import Dropdown from '../../components/Inputs/Dropdown'
import type { ListFilterPageSizeConfig, ListFilterValue, ListFilterValueNumber } from '../../types'
import { ListFilterType } from '../../types'

interface Props {
  filter: ListFilterPageSizeConfig | undefined
  totalCount: number
  onFilterChange: (value: ListFilterValue, id: string) => void
  value: ListFilterValueNumber
  tableHasCaption?: boolean
}

interface WrapperProps {
  hasCaption?: boolean
}
const PageSizeWrapper = styled.div<WrapperProps>`
  width: 100%;
  display: flex;
  justify-content: end;
  position: relative;
  z-index: 1;
  margin-top: ${(props) => (props.hasCaption ? '0' : '-3rem')};
  margin-bottom: ${(props) => (props.hasCaption ? '-2.5rem' : '0.5rem')};
`
const PageSizeInnerWrapper = styled.div`
  min-width: 18ch;
`

const ListPageSizeFilter: React.FC<Props> = ({ filter, totalCount, onFilterChange, value, tableHasCaption }) => {
  const pageSizes: number[] = filter ? filter.pageSizes : []
  const SHOW_ALL = 'show-all'
  const dispatch = useDispatch()

  if (!filter || pageSizes.length === 0 || totalCount <= pageSizes[0]) {
    return null
  }

  const resetStartFrom = () => {
    const startFrom: ListFilterValueNumber = {
      type: ListFilterType.NUMBER,
      value: 0,
    }

    dispatch(updateActiveListFilterValue({ filterValue: startFrom, id: 'START_FROM' }))
  }

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.options.selectedIndex
    const selectedId = event.target.options[selectedIndex ? selectedIndex : 0].id

    const value: ListFilterValueNumber = {
      type: ListFilterType.NUMBER,
      value: parseInt(event.target.value),
    }

    if (selectedId === SHOW_ALL) {
      resetStartFrom()
    }

    onFilterChange(value, filter.id)
  }

  const getFilterComponent = () => {
    return (
      <PageSizeWrapper className="iu-pr-300" hasCaption={tableHasCaption}>
        <PageSizeInnerWrapper>
          <Dropdown onChange={handleFilterChange} label={filter.title} id={filter.id} value={value ? value.value.toString() : ''}>
            {pageSizes.map((number) =>
              totalCount >= number ? (
                <option id={`${filter.id}-${number}`} value={number} key={`${filter.id}-${number}`}>
                  {number}
                </option>
              ) : null
            )}
            <option id={SHOW_ALL} value={totalCount} key={SHOW_ALL}>
              alla
            </option>
          </Dropdown>
        </PageSizeInnerWrapper>
      </PageSizeWrapper>
    )
  }

  return getFilterComponent()
}

export default ListPageSizeFilter
