import { ListConfig } from '../../../types'

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
