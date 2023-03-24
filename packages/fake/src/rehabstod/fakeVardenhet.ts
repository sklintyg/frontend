import { faker } from '@faker-js/faker'
import { vardenhetSchema } from '@frontend/types'
import { fakerFromSchema } from '../factory'

export const fakeVardenhet = fakerFromSchema(vardenhetSchema, {
  stringMap: {
    namn: faker.company.name,
  },
})
