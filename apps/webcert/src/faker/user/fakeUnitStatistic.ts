import type { UnitStatistic } from '../../types'

export function fakeUnitStatistic(data?: Partial<UnitStatistic>): UnitStatistic {
  return {
    draftsOnUnit: 3,
    questionsOnUnit: 0,
    draftsOnSubUnits: 1,
    questionsOnSubUnits: 5,
    ...data,
  }
}
