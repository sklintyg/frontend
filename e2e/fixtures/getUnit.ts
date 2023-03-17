import { Unit } from '../types/Unit'

function createUnits<T extends { [name: string]: Unit }>(unit: T) {
  return unit
}

const units = createUnits({
  AlfaVC: {
    enhetId: 'TSTNMT2321000156-ALVC',
    enhetNamn: 'Alfa Vårdcentral',
    vardgivareId: 'TSTNMT2321000156-ALFA',
    vardgivareNamn: 'Alfa Regionen',
  },
  AlfaMC: {
    enhetId: 'TSTNMT2321000156-ALMC',
    enhetNamn: 'Alfa-medicinklinik',
    vardgivareId: 'TSTNMT2321000156-ALFA',
    vardgivareNamn: 'Alfa Regionen',
  },
})

export function getUnit(unit: keyof typeof units) {
  return units[unit]
}
