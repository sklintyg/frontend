import faker from 'faker'
import type {
  ListFilterValueBoolean,
  ListFilterValueDateRange,
  ListFilterValueNumber,
  ListFilterValuePersonId,
  ListFilterValueRadio,
  ListFilterValueSelect,
  ListFilterValueText,
} from '../../types'
import { ListFilterType } from '../../types'
import { fakePersonId } from '../fakePatient'

function fakeListFilterValueText(data?: Partial<ListFilterValueText>): ListFilterValueText {
  return { type: ListFilterType.TEXT, value: faker.lorem.word(), ...data }
}

function fakeListFilterValueBoolean(data?: Partial<ListFilterValueBoolean>): ListFilterValueBoolean {
  return { type: ListFilterType.BOOLEAN, value: false, ...data }
}

function fakeListFilterValueNumber(data?: Partial<ListFilterValueNumber>): ListFilterValueNumber {
  return { type: ListFilterType.NUMBER, value: faker.datatype.number(), ...data }
}

function fakeListFilterValuePersonId(data?: Partial<ListFilterValuePersonId>): ListFilterValuePersonId {
  return { type: ListFilterType.PERSON_ID, value: fakePersonId().id, ...data }
}

function fakeListFilterValueDateRange(data?: Partial<ListFilterValueDateRange>): ListFilterValueDateRange {
  return {
    type: ListFilterType.DATE_RANGE,
    from: faker.date.past().toISOString().split('T')[0],
    to: faker.date.past().toISOString().split('T')[0],
    ...data,
  }
}

function fakeListFilterValueSelect(data?: Partial<ListFilterValueSelect>): ListFilterValueSelect {
  return { type: ListFilterType.SELECT, value: faker.lorem.word(), ...data }
}

function fakeListFilterValueRadio(data?: Partial<ListFilterValueRadio>): ListFilterValueRadio {
  return { type: ListFilterType.RADIO, value: faker.lorem.word(), ...data }
}
