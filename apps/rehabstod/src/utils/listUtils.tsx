import { SickLeaveInfo } from '../store/types/sickLeave'

export const CURRENT_SICK_LEAVES_TABLE_HEADERS = [
  'Personnummer',
  'Ålder',
  'Namn',
  'Kön',
  'Diagnos/er',
  'Startdatum',
  'Slutdatum',
  'Längd',
  'Intyg',
  'Grad',
  'Läkare',
]

export const getSickLeaveContent = (tableHeader: string, sickLeave: SickLeaveInfo) => {
  switch (tableHeader) {
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[0]:
      return sickLeave.patient.id
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[1]:
      return sickLeave.patient.alder
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[2]:
      return sickLeave.patient.namn
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[3]:
      return sickLeave.patient.kon === 'F' ? 'Kvinna' : 'Man'
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[4]:
      return (
        <>
          {sickLeave.diagnos.kod} {sickLeave.diagnos.beskrivning}
          {sickLeave.biDiagnoser.map((diagnosis) => (
            <>,{` ${diagnosis.kod}`}</>
          ))}
        </>
      )
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[5]:
      return sickLeave.start
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[6]:
      return sickLeave.slut
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[7]:
      return sickLeave.dagar
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[8]:
      return sickLeave.intyg
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[9]:
      return `${sickLeave.aktivGrad}%`
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[10]:
      return sickLeave.lakare.namn
    default:
      return ''
  }
}

export const getCurrentSickLeavesSortFunction = (tableHeader: string, a: SickLeaveInfo, b: SickLeaveInfo) => {
  switch (tableHeader) {
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[0]:
      return a.patient.id > b.patient.id ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[1]:
      return a.patient.alder > b.patient.alder ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[2]:
      return a.patient.namn > b.patient.namn ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[3]:
      return a.patient.kon === 'F' ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[4]:
      return a.diagnos.kod > b.diagnos.kod ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[5]:
      return a.start > b.start ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[6]:
      return a.slut > b.slut ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[7]:
      return a.dagar > b.dagar ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[8]:
      return a.intyg > b.intyg ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[9]:
      return a.aktivGrad > b.aktivGrad ? 1 : -1
    case CURRENT_SICK_LEAVES_TABLE_HEADERS[10]:
      return a.lakare.namn > b.lakare.namn ? 1 : -1
    default:
      return -1
  }
}
