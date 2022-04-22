import * as React from 'react'
import { CustomButton } from '@frontend/common/src/components'
import styled from 'styled-components/macro'

interface Props {
  searchTooltip: string
  onSearch: () => void
  onReset: () => void
  isSearchEnabled: boolean
}

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`

const ListFilterButtons: React.FC<Props> = ({ searchTooltip, onSearch, onReset, isSearchEnabled }) => {
  return (
    <Wrapper>
      <CustomButton buttonStyle="primary" text="Sök" tooltip={searchTooltip} onClick={onSearch} disabled={!isSearchEnabled} />
      <CustomButton buttonStyle="secondary" text="Återställ sökfiltret" tooltip="Rensa sökfiltret." onClick={onReset} />
    </Wrapper>
  )
}

export default ListFilterButtons
