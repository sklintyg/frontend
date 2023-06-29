import { fakerFromSchema } from '@frontend/fake'
import { patientSjukfallIntygSchema } from '../../../schemas/patientSchema'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'
import { getCertificateColumnData } from './getCertificateColumnData'

it.each(Object.values(PatientColumn).filter((name) => name !== PatientColumn.Visa))('Should return value on column %s', (column) => {
  const certificate = fakerFromSchema(patientSjukfallIntygSchema)()
  expect(getCertificateColumnData(column, certificate, [certificate])?.toString()).toBeTruthy()
})
