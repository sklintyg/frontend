import { fakerFromSchema } from '@frontend/fake'
import { expect, it } from 'vitest'
import { getCertificateColumnData } from './getCertificateColumnData'
import { patientSjukfallIntygSchema } from '../../../schemas/patientSchema'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'

it.each(Object.values(PatientColumn).filter((name) => name !== PatientColumn.Intyg && name !== PatientColumn.Intygstyp))(
  'Should return value on column %s',
  (column) => {
    const certificate = fakerFromSchema(patientSjukfallIntygSchema)()
    expect(getCertificateColumnData(column, certificate, [certificate])?.toString()).toBeTruthy()
  }
)
