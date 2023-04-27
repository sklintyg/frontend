import { faker, fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { patientSchema, patientSjukfallSchema } from '../../schemas/patientSchema'

const fakePatientSjukfallFactory = fakerFromSchema(patientSjukfallSchema)

export const fakePatient = fakerFromSchemaFactory(patientSchema, {
  sjukfallList: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, fakePatientSjukfallFactory),
  srsError: faker.datatype.boolean(),
  kompletteringInfoError: faker.datatype.boolean(),
})
