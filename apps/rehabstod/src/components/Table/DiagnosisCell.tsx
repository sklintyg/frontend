import { SickLeaveDiagnosis } from '../../schemas/sickLeaveSchema'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'

export function DiagnosisCell({ diagnos, biDiagnoser }: { diagnos: SickLeaveDiagnosis; biDiagnoser: SickLeaveDiagnosis[] }) {
  if (!diagnos) {
    return <td>Okänt</td>
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <td tabIndex={0}>
          <span>
            {diagnos.kod} {diagnos.beskrivning}
          </span>
          {biDiagnoser.length > 0 && `, ${biDiagnoser.map(({ kod }) => kod).join(', ')}`}
        </td>
      </TooltipTrigger>
      <TooltipContent>
        <ul>
          {[diagnos].concat(biDiagnoser).map(({ kod, beskrivning }) => (
            <li key={kod}>
              {kod} - {beskrivning}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
