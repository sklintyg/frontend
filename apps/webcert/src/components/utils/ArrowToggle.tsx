import styled from 'styled-components'
import arrow from '../../images/arrow-down.svg'

const StyledButton = styled.button`
  border: none;
  background: none;
`

const ArrowDown = styled.img`
  width: 0.9em;
  display: inline-block;
`

const ArrowUp = styled(ArrowDown)`
  transform: rotate(180deg);
`

interface Props {
  onClick: () => void
  className?: string
  isUp: boolean
  label?: string
}

const ArrowToggle = ({ onClick, className, isUp, label = 'Fäll ut/in innehåll' }: Props) => {
  return (
    <StyledButton onClick={onClick} tabIndex={-1} className={className} data-testid="arrowToggle" aria-expanded={isUp} aria-label={label}>
      {isUp ? <ArrowUp src={arrow} alt="" /> : <ArrowDown src={arrow} alt="" />}
      <span className="iu-sr-only" aria-hidden="true">
        {label}
      </span>
    </StyledButton>
  )
}

export default ArrowToggle
