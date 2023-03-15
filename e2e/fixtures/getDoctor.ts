import { Doctor } from '../types/Doctor'

function createDoctors<T extends { [name: string]: Doctor }>(doctor: T) {
  return doctor
}

const doctors = createDoctors({
  Alja: {
    forNamn: 'Ajla',
    efterNamn: 'Doktor',
    hsaId: 'TSTNMT2321000156-DRAA',
    legitimeradeYrkesgrupper: ['Läkare'],
    titel: 'Läkare',
  },
})

export function getDoctor(doctor: keyof typeof doctors) {
  return doctors[doctor]
}
