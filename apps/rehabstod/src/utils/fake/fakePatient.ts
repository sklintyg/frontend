import { faker, fakerFromSchema } from '@frontend/fake'
import { GenerateMockOptions } from '@anatine/zod-mock'
import { patientSchema, patientSjukfallSchema } from '../../schemas/patientSchema'

const fakePatientSjukfall = fakerFromSchema(patientSjukfallSchema)

export const fakePatient = fakerFromSchema(patientSchema, {
  sjukfallList: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, fakePatientSjukfall),
  srsError: faker.datatype.boolean(),
  kompletteringInfoError: faker.datatype.boolean(),
} as Omit<GenerateMockOptions, 'sjfMetaData'>)
