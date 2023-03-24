import { faker } from '@faker-js/faker'
import { vardgivareSchema } from '@frontend/types'
import { fakerFromSchemaFactory } from '../factory'
import { fakeVardenhet } from './fakeVardenhet'

export const fakeVardgivare = fakerFromSchemaFactory(
  vardgivareSchema,
  {
    vardenheter: Array.from({ length: 3 }, fakeVardenhet),
  },
  {
    stringMap: {
      namn: faker.company.name,
    },
  }
)
