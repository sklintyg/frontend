import { CertificateDataConfig } from '@frontend/common'
import faker from 'faker'

interface ListItem extends Omit<CertificateDataConfig, 'type'> {
  id: string
  label: string
}

export const fakeList = (length = 5, shortItems?: boolean): ListItem[] =>
  new Array(length).fill(0).map(() => (shortItems === true ? shortFakeListItem() : fakeListItem()))

export const fakeListItem = (data?: Partial<ListItem>): ListItem => {
  return {
    text: faker.lorem.sentence(),
    description: '',
    id: faker.random.alpha({ count: 10 }),
    label: faker.lorem.sentence(5),
    ...data,
  }
}

export const shortFakeListItem = (data?: Partial<ListItem>): ListItem => {
  return {
    type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
    text: faker.lorem.sentence(),
    description: '',
    id: faker.random.alpha({ count: 10 }),
    label: faker.lorem.word(3).toUpperCase(),
    ...data,
  }
}
