import { faker, fakerFromSchemaFactory } from '@frontend/fake'
import { vardgivareSchema } from '../../schemas'
import { fakeVardenhet } from './fakeVardenhet'

export const fakeVardgivare = fakerFromSchemaFactory(
  vardgivareSchema,
  () => ({
    vardenheter: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, fakeVardenhet),
  }),
  {
    stringMap: {
      namn: faker.company.name,
    },
  }
)
