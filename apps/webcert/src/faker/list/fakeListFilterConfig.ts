import faker from 'faker'
import type {
  ListFilterBooleanConfig,
  ListFilterConfigBase,
  ListFilterDateConfig,
  ListFilterDateRangeConfig,
  ListFilterOrderConfig,
  ListFilterPageSizeConfig,
  ListFilterPersonIdConfig,
  ListFilterRadioConfig,
  ListFilterSelectConfig,
  ListFilterTextConfig,
} from '../../types'
import { ListFilterType } from '../../types'
import { fakeId } from '../fakeId'

export function fakeListFilterConfigBase(data?: Partial<ListFilterConfigBase>): ListFilterConfigBase {
  return {
    id: fakeId(),
    title: faker.lorem.sentence(),
    alwaysHighlighted: false,
    description: faker.lorem.sentence(),
    ...data,
  }
}

export function fakePageSizeFilter(data?: Partial<ListFilterPageSizeConfig>): ListFilterPageSizeConfig {
  return {
    type: ListFilterType.PAGESIZE,
    pageSizes: [10, 20, 50, 100],
    ...fakeListFilterConfigBase(data),
  }
}

export function fakeTextFilter(data?: Partial<ListFilterTextConfig>): ListFilterTextConfig {
  return {
    type: ListFilterType.TEXT,
    placeholder: 'test',
    ...fakeListFilterConfigBase(data),
  }
}

export function fakeBooleanFilter(data?: Partial<ListFilterBooleanConfig>): ListFilterBooleanConfig {
  return {
    type: ListFilterType.BOOLEAN,
    defaultValue: true,
    ...fakeListFilterConfigBase(data),
  }
}

export function fakePersonIdFilter(data?: Partial<ListFilterPersonIdConfig>): ListFilterPersonIdConfig {
  return {
    type: ListFilterType.PERSON_ID,
    placeholder: 'test',
    ...fakeListFilterConfigBase(data),
  }
}

export function fakeSelectFilter(data?: Partial<ListFilterSelectConfig>): ListFilterSelectConfig {
  return {
    type: ListFilterType.SELECT,
    description: 'description',
    ...fakeListFilterConfigBase(data),
    values: data?.values ?? [
      { id: 'option1', name: 'option1', defaultValue: false },
      { id: 'option2', name: 'option2', defaultValue: true },
    ],
  }
}

export function fakeRadioFilter(data?: Partial<ListFilterRadioConfig>): ListFilterRadioConfig {
  return {
    type: ListFilterType.RADIO,
    description: 'description',
    ...fakeListFilterConfigBase(data),
    values: data?.values ?? [
      { id: 'radio1', name: 'radio1', defaultValue: false },
      { id: 'radio2', name: 'radio2', defaultValue: true },
    ],
  }
}

export function fakeDateFilter(data?: Partial<ListFilterDateConfig>): ListFilterDateConfig {
  return {
    type: ListFilterType.DATE,
    id: fakeId(),
    title: faker.lorem.sentence(),
    defaultValue: faker.lorem.word(),
    alwaysHighlighted: false,
    ...data,
  }
}

export function fakeDateRangeFilter(data?: Partial<ListFilterDateRangeConfig>): ListFilterDateRangeConfig {
  return {
    type: ListFilterType.DATE_RANGE,
    forbidFutureDates: false,
    ...fakeListFilterConfigBase(data),
    to: fakeDateFilter({
      type: ListFilterType.DATE,
      id: 'to',
      title: 'to',
      defaultValue: 'default1',
      alwaysHighlighted: false,
      ...data?.to,
    }),
    from: fakeDateFilter({
      type: ListFilterType.DATE,
      id: 'from',
      title: 'from',
      defaultValue: 'default2',
      alwaysHighlighted: false,
      ...data?.from,
    }),
  }
}

export function fakeOrderFilter(data?: Partial<ListFilterOrderConfig>): ListFilterOrderConfig {
  return {
    type: ListFilterType.ORDER,
    defaultValue: 'defaultOrder',
    ...fakeListFilterConfigBase(data),
  }
}
