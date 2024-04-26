import { UserStatistics } from '../../types'

export function fakeUserStatistics(data?: Partial<UserStatistics>): UserStatistics {
  return {
    nbrOfDraftsOnSelectedUnit: 6,
    nbrOfUnhandledQuestionsOnSelectedUnit: 10,
    totalDraftsAndUnhandledQuestionsOnOtherUnits: 17,
    unitStatistics: {},
    ...data,
  }
}
