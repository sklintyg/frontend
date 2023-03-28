import { faker } from '@faker-js/faker'
import { mottagningSchema, vardenhetSchema } from '@frontend/types'
import { fakerFromSchema, fakerFromSchemaFactory } from '../factory'

const fakeMottagning = fakerFromSchema(mottagningSchema)

export const fakeVardenhet = fakerFromSchemaFactory(
  vardenhetSchema,
  {
    mottagningar: Array.from({ length: faker.datatype.number({ max: 3 }) }, fakeMottagning),
  },
  {
    stringMap: {
      namn: faker.company.name,
    },
  }
)
