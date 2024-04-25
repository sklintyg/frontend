import { fakeListConfig } from '../../../faker/list/fakeListConfig'
import { fakeTextFilter } from '../../../faker/list/fakeListFilterConfig'
import { CertificateListItemValueType, ListConfig, ListFilter, ListFilterType, ListType } from '../../../types'

export const getConfig = (
  filters = [],
  title = 'Title',
  openCertificateTooltip = 'Open tooltip',
  searchCertificateTooltip = 'Search tooltip',
  tableHeadings = [],
  defaultOrderBy = 'SAVED'
): ListConfig => {
  return {
    title: title,
    filters: filters,
    shouldUpdateConfigAfterListSearch: false,
    buttonTooltips: {
      OPEN_BUTTON: 'OPEN_BUTTON',
      SEARCH_BUTTON: 'SEARCH_BUTTON',
      RENEW_BUTTON: 'RENEW_BUTTON',
    },
    tableHeadings: tableHeadings,
    defaultOrderBy: defaultOrderBy,
    description: 'description',
    secondaryTitle: 'secondaryTitle',
    emptyListText: 'emptyListText',
    excludeFilterButtons: false,
  }
}

export const getFilterWithValues = (): ListFilter => {
  return {
    type: ListType.UNKOWN,
    values: {
      value: {
        type: ListFilterType.TEXT,
        value: 'test',
        // FILTER_ID: 'test',
      },
    },
  }
}

export const getConfigWithTextFilter = (): ListConfig => {
  return fakeListConfig({
    title: 'title',
    filters: [
      fakeTextFilter({
        type: ListFilterType.TEXT,
        id: 'TEXT_FILTER',
        title: 'title',
        placeholder: 'test',
        description: 'description',
        alwaysHighlighted: false,
      }),
    ],
    description: 'description',
    secondaryTitle: 'secondaryTitle',
    emptyListText: 'emptyListText',
    shouldUpdateConfigAfterListSearch: false,
    buttonTooltips: {
      OPEN_BUTTON: 'OPEN_BUTTON',
      SEARCH_BUTTON: 'SEARCH_BUTTON',
      RENEW_BUTTON: 'RENEW_BUTTON',
    },
    tableHeadings: [
      {
        id: 'id',
        title: 'title',
        type: CertificateListItemValueType.TEXT,
        description: 'description',
        defaultAscending: false,
      },
    ],
    defaultOrderBy: 'orderBy',
    excludeFilterButtons: false,
  })
}
