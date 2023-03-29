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

export const getCurrentSickLeavesTableHeaderDescription = (header: string, unitId?: string, daysBetweenCertificates?: string) => {
  if (header === 'Intyg') {
    return 'Antalet intyg som ingår i sjukfallet.'
  }

  if (header === 'Startdatum') {
    return `Datum då sjukfallet började på ${unitId}. Alla intyg för samma patient som följer på varandra med max ${daysBetweenCertificates} dagars uppehåll räknas till samma sjukfall. Max antal dagars uppehåll mellan intyg kan ställas in i inställningar.`
  }

  if (header === 'Slutdatum') {
    return 'Slutdatum för sjukfallet, dvs. den sista dagen då det finns ett giltigt intyg.'
  }

  if (header === 'Längd') {
    return 'Sjukfallets totala längd i dagar, från startdatum till slutdatum. Eventuella dagar mellan intyg räknas inte in.'
  }

  if (header === 'Grad') {
    return 'Sjukskrivningsgrad i nuvarande intyg. Om det innehåller flera grader anges de ordnade i tidsföljd med markering av den just nu gällande graden.'
  }

  if (header === 'Diagnos/er') {
    return 'Diagnos/diagnoser i nuvarande intyg. Om det finns flera diagnoser så är den som anges först den som påverkar arbetsförmågan mest. För muspekaren över koden för att se vilken diagnos den motsvarar.'
  }

  return ''
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
