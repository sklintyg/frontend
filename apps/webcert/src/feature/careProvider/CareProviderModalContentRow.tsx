import type { MouseEventHandler } from 'react'
import styled from 'styled-components'
import type { Unit, UnitStatistic } from '../../types'

const StyledButton = styled.button<{ expanded: boolean }>`
  text-indent: 1.2rem;
  margin-left: ${(props) => (props.expanded ? '0.675rem' : '0')};
`

export function CareProviderModalContentRow({
  unit,
  name,
  loggedIn,
  onChoose,
  questionsOnUnit,
  draftsOnUnit,
  expanded = false,
}: {
  unit: Unit
  name: string
  loggedIn: boolean
  expanded?: boolean
  statistics?: UnitStatistic
  questionsOnUnit?: string
  draftsOnUnit?: string
  onChoose: MouseEventHandler
}) {
  return (
    <tr key={unit.unitId}>
      <td>
        <StyledButton
          className={`ic-link iu-text-left iu-border-white ${loggedIn && 'iu-color-muted ic-button--disabled'}`}
          type="button"
          id={unit.unitId}
          onClick={onChoose}
          disabled={loggedIn}
          expanded={expanded}
        >
          {name}
        </StyledButton>
      </td>
      {questionsOnUnit && <td>{questionsOnUnit}</td>}
      {draftsOnUnit && <td>{draftsOnUnit}</td>}
    </tr>
  )
}
