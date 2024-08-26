import faker from 'faker'
import type { ListConfig } from '../../types'

export function fakeListConfig(data?: Partial<ListConfig>): ListConfig {
  return {
    title: faker.lorem.sentence(),
    shouldUpdateConfigAfterListSearch: false,
    buttonTooltips: {
      OPEN_BUTTON: 'OPEN_BUTTON',
      SEARCH_BUTTON: 'SEARCH_BUTTON',
      RENEW_BUTTON: 'RENEW_BUTTON',
    },
    defaultOrderBy: data?.tableHeadings?.[0].id ?? '',
    description: 'description',
    secondaryTitle: 'secondaryTitle',
    emptyListText: 'emptyListText',
    excludeFilterButtons: false,
    ...data,
    filters: data?.filters ?? [],
    tableHeadings: data?.tableHeadings ?? [],
  }
}
