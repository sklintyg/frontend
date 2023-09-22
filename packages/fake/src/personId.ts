import { faker } from '@faker-js/faker'

export const fakePersonId = () => {
  const currentYear = new Date().getUTCFullYear()
  const year = faker.datatype.number({ min: currentYear - 100, max: currentYear - 20 })
  const month = faker.datatype.number({ min: 1, max: 12 }).toString().padStart(2, '0')
  const day = faker.datatype.number({ min: 1, max: 31 }).toString().padStart(2, '0')
  const id = faker.datatype
    .number({ min: 1, max: 1e4 - 1 })
    .toString()
    .padStart(2, '0')

  return `${year}${month}${day}${id}`
}
