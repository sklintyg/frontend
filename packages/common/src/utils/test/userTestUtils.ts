import { Unit } from '../../types/certificate'
import { ResourceLinkType } from '../../types/resourceLink'
import { User, LoginMethod, SigningMethod, UserStatistics, UnitStatistic, UnitStatistics } from '../../types/user'

export const getUser = (): User => {
  const unit: Unit = {
    unitId: '1234a',
    unitName: 'Care unit',
    address: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
    email: '',
    isInactive: false,
  }

  return {
    hsaId: '',
    name: '',
    role: 'doctor',
    loggedInUnit: unit,
    loggedInCareUnit: unit,
    loggedInCareProvider: unit,
    preferences: null,
    loginMethod: LoginMethod.BANK_ID,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
    careProviders: [
      {
        id: '',
        name: 'Care Provider',
        careUnits: [
          {
            unitId: '1234a',
            unitName: 'Care unit',
            address: '',
            zipCode: '',
            city: '',
            phoneNumber: '',
            email: '',
            isInactive: false,
            units: [
              {
                unitId: '1234b',
                unitName: 'Unit',
                address: '',
                zipCode: '',
                city: '',
                phoneNumber: '',
                email: '',
                isInactive: false,
              },
            ],
          },
        ],
      },
    ],
  }
}

export const getUserWithInactiveUnit = (): User => {
  const unit: Unit = {
    unitId: '1234a',
    unitName: 'Care unit',
    address: '',
    zipCode: '',
    city: '',
    phoneNumber: '',
    email: '',
    isInactive: true,
  }

  return {
    hsaId: '',
    name: '',
    role: 'doctor',
    loggedInUnit: unit,
    loggedInCareUnit: unit,
    loggedInCareProvider: unit,
    preferences: null,
    loginMethod: LoginMethod.BANK_ID,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
    careProviders: [
      {
        id: '',
        name: 'Care Provider',
        careUnits: [
          {
            unitId: '1234a',
            unitName: 'Care unit',
            address: '',
            zipCode: '',
            city: '',
            phoneNumber: '',
            email: '',
            isInactive: false,
            units: [
              {
                unitId: '1234b',
                unitName: 'Unit',
                address: '',
                zipCode: '',
                city: '',
                phoneNumber: '',
                email: '',
                isInactive: false,
              },
            ],
          },
        ],
      },
    ],
  }
}

export const getUserWithEmptyUnit = (): User => {
  const emptyUnit = {} as Unit

  return {
    hsaId: '',
    name: '',
    role: 'doctor',
    loggedInUnit: emptyUnit,
    loggedInCareUnit: emptyUnit,
    loggedInCareProvider: emptyUnit,
    preferences: null,
    loginMethod: LoginMethod.BANK_ID,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
    careProviders: [
      {
        id: '',
        name: 'Care Provider',
        careUnits: [
          {
            unitId: '1234a',
            unitName: 'Care unit',
            address: '',
            zipCode: '',
            city: '',
            phoneNumber: '',
            email: '',
            isInactive: false,
            units: [
              {
                unitId: '1234b',
                unitName: 'Unit',
                address: '',
                zipCode: '',
                city: '',
                phoneNumber: '',
                email: '',
                isInactive: false,
              },
            ],
          },
        ],
      },
    ],
  }
}

export const getUserWithEmptyCareUnitWithoutUnits = (): User => {
  const emptyUnit = {} as Unit

  return {
    hsaId: '',
    name: '',
    role: 'doctor',
    loggedInUnit: emptyUnit,
    loggedInCareUnit: emptyUnit,
    loggedInCareProvider: emptyUnit,
    preferences: null,
    loginMethod: LoginMethod.BANK_ID,
    signingMethod: SigningMethod.FAKE,
    protectedPerson: false,
    careProviders: [
      {
        id: '',
        name: 'Care Provider',
        careUnits: [
          {
            unitId: '1234a',
            unitName: 'Care unit',
            address: '',
            zipCode: '',
            city: '',
            phoneNumber: '',
            email: '',
            isInactive: false,
            units: [],
          },
        ],
      },
    ],
  }
}

export const getUserStatistics = (): UserStatistics => {
  const unitStatistic: UnitStatistic = {
    draftsOnUnit: 3,
    questionsOnUnit: 0,
    draftsOnSubUnits: 1,
    questionsOnSubUnits: 5,
  }

  const unitStatistics: UnitStatistics = {
    '1234a': unitStatistic,
    '1234b': unitStatistic,
  }

  return {
    nbrOfDraftsOnSelectedUnit: 6,
    nbrOfUnhandledQuestionsOnSelectedUnit: 10,
    totalDraftsAndUnhandledQuestionsOnOtherUnits: 17,
    unitStatistics: unitStatistics,
  }
}

export const getUserStatisticsForOneCareUnit = (): UserStatistics => {
  const unitStatistic: UnitStatistic = {
    draftsOnUnit: 3,
    questionsOnUnit: 2,
    draftsOnSubUnits: 0,
    questionsOnSubUnits: 0,
  }

  const unitStatistics: UnitStatistics = {
    '1234a': unitStatistic,
  }

  return {
    nbrOfDraftsOnSelectedUnit: 6,
    nbrOfUnhandledQuestionsOnSelectedUnit: 10,
    totalDraftsAndUnhandledQuestionsOnOtherUnits: 17,
    unitStatistics: unitStatistics,
  }
}

export const getChooseUnitResourceLink = () => {
  return [
    {
      type: ResourceLinkType.CHOOSE_UNIT,
      name: 'Välj vårdenhet',
      body: '',
      description: '',
      enabled: true,
    },
  ]
}
