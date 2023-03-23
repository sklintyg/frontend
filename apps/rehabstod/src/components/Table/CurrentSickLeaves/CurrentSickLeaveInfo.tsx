import { SickLeaveInfo } from '../../../store/types/sickLeave'

export function CurrentSickLeaveInfo({ sickLeave }: { sickLeave: SickLeaveInfo }) {
  return (
    <>
      <td>{sickLeave.patient.id}</td>
      <td>{sickLeave.patient.alder}</td>
      <td>{sickLeave.patient.namn}</td>
      <td>{sickLeave.patient.kon}</td>
      <td>
        {sickLeave.diagnos.map((diagnosis) => (
          <>
            {diagnosis.kod} {diagnosis.beskrivning}
          </>
        ))}
        {sickLeave.biDiagnoser.map((code, index) => (
          <>
            {code}
            {index !== sickLeave.biDiagnoser.length - 1 && ','}
          </>
        ))}
      </td>
      <td>{sickLeave.start}</td>
      <td>{sickLeave.slut}</td>
      <td>{sickLeave.intyg}</td>
      <td>{sickLeave.aktivGrad}%</td>
      <td>{sickLeave.lakare.namn}</td>
    </>
  )
}
