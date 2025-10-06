import faker from 'faker'
import type { CertificateDataConfig } from '../types/certificate'

interface ListItem extends Omit<CertificateDataConfig, 'type'> {
  id: string
  label: string
}

export const fakeList = (length = 5): ListItem[] => new Array(length).fill(0).map(() => fakeListItem())

const fakeListItem = (data?: Partial<ListItem>): ListItem => {
  return {
    text: faker.lorem.sentence(),
    description: '',
    id: faker.random.alpha({ count: 10 }),
    label: faker.lorem.sentence(5),
    ...data,
  }
}
