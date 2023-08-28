import { generateMock, GenerateMockOptions } from '@anatine/zod-mock'
import { fakerSV as faker } from '@faker-js/faker'
import { deepmergeCustom, DeepMergeLeafURI } from 'deepmerge-ts'
import { DeepPartial } from 'ts-essentials'
import { z, ZodTypeAny } from 'zod'

const fakeHSA = () =>
  `${faker.string.alpha({ length: 6, casing: 'upper' })}${faker.number.int({ min: 1e9 })}-${faker.number.int({ min: 1e3 })}`

export { fakerSV as faker } from '@faker-js/faker'

export const stringMap = {
  id: faker.string.uuid,
  hsaId: fakeHSA,
  forvaldEnhet: fakeHSA,
  unitId: fakeHSA,
  namn: faker.person.fullName,
  fornamn: faker.person.firstName,
  efternamn: faker.person.lastName,
  stad: faker.location.city,
  postadress: faker.location.streetAddress,
  postnummer: faker.location.zipCode,
  postort: faker.location.city,
  epost: faker.internet.email,
  telefonnummer: faker.phone.number,
  arbetsplatskod: faker.string.uuid,
}

const customDeepmerge = deepmergeCustom<{
  DeepMergeArraysURI: DeepMergeLeafURI
}>({
  mergeArrays: false,
})

export function fakerFromSchema<T extends ZodTypeAny>(schema: T, options?: GenerateMockOptions) {
  return (data?: DeepPartial<z.infer<T>>) =>
    customDeepmerge(generateMock(schema, { faker, ...options, stringMap: { ...stringMap, ...options?.stringMap } }), data ?? {})
}

export function fakerFromSchemaFactory<T extends ZodTypeAny>(
  schema: T,
  initialData: (data?: DeepPartial<z.infer<T>>) => DeepPartial<z.infer<T>>,
  options?: GenerateMockOptions
) {
  return (data?: DeepPartial<z.infer<T>>) => fakerFromSchema(schema, options)({ ...initialData(data), ...data })
}
