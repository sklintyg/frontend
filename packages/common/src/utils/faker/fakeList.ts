import { CertificateDataConfig, ConfigTypes } from '@frontend/common'
import faker from 'faker'

interface ListItem extends CertificateDataConfig {
  id: string
  label: string
}

export const fakeList = (length = 5): ListItem[] => new Array(length).fill(0).map(() => fakeListItem())

export const fakeListItem = (data?: Partial<ListItem>): ListItem => {
  return {
    type: ConfigTypes.UE_RADIO_MULTIPLE_CODE,
    text: faker.lorem.sentence(),
    description: '',
    id: faker.random.alpha({ count: 10 }),
    label: faker.lorem.sentence(5),
    ...data,
  }
}
