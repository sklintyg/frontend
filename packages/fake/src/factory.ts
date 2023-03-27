import { generateMock, GenerateMockOptions } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
import { merge } from 'lodash'
import { PartialDeep } from 'type-fest'
import { z, ZodTypeAny } from 'zod'

export const stringMap = {
  namn: faker.name.fullName,
  fornamn: faker.name.firstName,
  efternamn: faker.name.lastName,
  hsaId: () =>
    `${faker.random.alpha({ count: 6, casing: 'upper' })}${faker.datatype.number({ min: 1e9 })}-${faker.datatype.number({ min: 1e3 })}`,
  stad: faker.address.city,
  postadress: faker.address.streetAddress,
  postnummer: faker.address.zipCode,
  postort: faker.address.cityName,
  epost: faker.internet.email,
  telefonnummer: faker.phone.number,
  arbetsplatskod: faker.datatype.uuid,
}

export function fakerFromSchema<T extends ZodTypeAny>(schema: T, options?: GenerateMockOptions) {
  return (data?: PartialDeep<z.infer<T>>) => merge(generateMock(schema, { stringMap, ...options }), data)
}

export function fakerFromSchemaFactory<T extends ZodTypeAny>(
  schema: T,
  initialData: PartialDeep<z.infer<T>>,
  options?: GenerateMockOptions
) {
  return (data?: PartialDeep<z.infer<T>>) => fakerFromSchema(schema, options)({ ...initialData, ...data })
}
