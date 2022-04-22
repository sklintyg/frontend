import {
  CertificateListItemValueType,
  ListConfig,
  ListFilter,
  ListFilterBooleanConfig,
  ListFilterDateRangeConfig,
  ListFilterOrderConfig,
  ListFilterPageSizeConfig,
  ListFilterPersonIdConfig,
  ListFilterSelectConfig,
  ListFilterTextConfig,
  ListFilterType,
} from '@frontend/common/src/types/list'

export const getPageSizeFilter = (): ListFilterPageSizeConfig => {
  return {
    type: ListFilterType.PAGESIZE,
    id: 'PAGE_SIZE_FILTER',
    title: 'title',
    pageSizes: [10, 20, 50, 100],
    description: 'description',
    alwaysHighlighted: false,
  }
}
export const getTextFilter = (title = 'title'): ListFilterTextConfig => {
  return {
    type: ListFilterType.TEXT,
    id: 'TEXT_FILTER',
    title: title,
    placeholder: 'test',
    description: 'description',
    alwaysHighlighted: false,
  }
}
export const getBooleanFilter = (title = 'title'): ListFilterBooleanConfig => {
  return {
    type: ListFilterType.BOOLEAN,
    id: 'TEXT_FILTER',
    title: title,
    defaultValue: true,
    description: 'description',
    alwaysHighlighted: false,
  }
}
export const getPersonIdFilter = (title = 'title'): ListFilterPersonIdConfig => {
  return {
    type: ListFilterType.PERSON_ID,
    id: 'PERSON_FILTER',
    title: title,
    placeholder: 'test',
    description: 'description',
    alwaysHighlighted: false,
  }
}
export const getSelectFilter = (title = 'title'): ListFilterSelectConfig => {
  return {
    type: ListFilterType.SELECT,
    id: 'PERSON_FILTER',
    title: title,
    description: 'description',
    alwaysHighlighted: false,
    values: [
      { id: 'option1', name: 'option1', defaultValue: false },
      { id: 'option2', name: 'option2', defaultValue: true },
    ],
  }
}
export const getDateRangeFilter = (title = 'title', toTitle = 'to', fromTitle = 'from'): ListFilterDateRangeConfig => {
  return {
    type: ListFilterType.DATE_RANGE,
    id: 'DATE_RANGE_FILTER',
    title: title,
    to: {
      type: ListFilterType.DATE,
      id: 'to',
      title: toTitle,
      defaultValue: 'default1',
    },
    from: {
      type: ListFilterType.DATE,
      id: 'from',
      title: fromTitle,
      defaultValue: 'default2',
    },
  }
}
export const getOrderFilter = (title = 'title'): ListFilterOrderConfig => {
  return {
    type: ListFilterType.ORDER,
    id: 'PERSON_FILTER',
    title: title,
    defaultValue: 'defaultOrder',
    description: 'description',
    alwaysHighlighted: false,
  }
}

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
    openCertificateTooltip: openCertificateTooltip,
    searchCertificateTooltip: searchCertificateTooltip,
    tableHeadings: tableHeadings,
    defaultOrderBy: defaultOrderBy,
    description: 'description',
    secondaryTitle: 'secondaryTitle',
    emptyListText: 'emptyListText',
  }
}

export const getFilter = (values = {}): ListFilter => {
  return {
    values: values,
  }
}

export const getFilterWithValues = (): ListFilter => {
  return {
    values: {
      value: {
        type: ListFilterType.TEXT,
        FILTER_ID: 'test',
      },
    },
  }
}

export const getConfigWithTextFilter = (): ListConfig => {
  return {
    title: 'title',
    filters: [getTextFilter()],
    openCertificateTooltip: 'tooltip',
    searchCertificateTooltip: 'tooltip',
    description: 'description',
    secondaryTitle: 'secondaryTitle',
    emptyListText: 'emptyListText',
    tableHeadings: [
      {
        id: 'id',
        title: 'title',
        type: CertificateListItemValueType.TEXT,
        description: 'description',
      },
    ],
    defaultOrderBy: 'orderBy',
  }
}

export const getDefaultList = () => {
  return [
    {
      values: {
        id: 'example',
      },
    },
  ]
}
