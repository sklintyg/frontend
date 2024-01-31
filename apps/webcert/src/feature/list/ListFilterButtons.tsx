import styled from 'styled-components'
import { CustomButton } from '../../components/Inputs/CustomButton'

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
