import { createElement } from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon } from '../../images'

const SortingButton = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  color: #5f5f5f;
  font-size: 0.68em;
  vertical-align: 0.165em;
  min-width: 2em;
`

export function SortingArrow({ id, orderBy, ascending }: { id: string; orderBy: string; ascending: boolean }) {
  if (id === orderBy) {
    return (
      <SortingButton aria-label={`Byt till att sortera ${ascending ? 'fallande' : 'stigande'}`}>
        {createElement(ascending ? ChevronUpIcon : ChevronDownIcon, {
          className: 'iu-color-main',
          size: 'sm',
          'aria-label': `Kolumnen sorteras ${ascending ? 'stigande' : 'fallande'}`,
        })}
      </SortingButton>
    )
  } else {
    return (
      <SortingButton aria-label="Sortera på kolumn">
        <ChevronUpIcon size="sm" />
        <ChevronDownIcon size="sm" />
      </SortingButton>
    )
  }
}
