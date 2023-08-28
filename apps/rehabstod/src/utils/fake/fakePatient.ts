import { faker, fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { patientSchema, patientSjukfallIntygSchema, patientSjukfallSchema } from '../../schemas/patientSchema'

const fakePatientSjukfallFactory = fakerFromSchemaFactory(patientSjukfallSchema, () => ({
  intyg: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, fakerFromSchema(patientSjukfallIntygSchema)),
}))

export const fakePatient = fakerFromSchemaFactory(patientSchema, () => ({
  sjukfallList: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, fakePatientSjukfallFactory),
  srsError: faker.datatype.boolean(),
  kompletteringInfoError: faker.datatype.boolean(),
}))
