import { CustomButton } from '@frontend/common'
import * as React from 'react'
import styled from 'styled-components'

interface Props {
  searchTooltip: string
  resetTooltip: string
  onSearch: () => void
  onReset: () => void
  isSearchEnabled: boolean
}

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`

const ListFilterButtons: React.FC<Props> = ({ searchTooltip, onSearch, onReset, isSearchEnabled, resetTooltip }) => {
  return (
    <Wrapper>
      <CustomButton buttonStyle="primary" text="Sök" tooltip={searchTooltip} onClick={onSearch} disabled={!isSearchEnabled} inline={true} />
      <CustomButton buttonStyle="secondary" text="Återställ sökfilter" tooltip={resetTooltip} onClick={onReset} inline={true} />
    </Wrapper>
  )
}

export default ListFilterButtons
