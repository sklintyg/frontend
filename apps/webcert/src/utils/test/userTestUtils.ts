import { Unit } from '../../types/certificate'
import { ResourceLink, ResourceLinkType } from '../../types/resourceLink'
import { LoginMethod, SigningMethod, UnitStatistic, UnitStatistics, User, UserStatistics } from '../../types/user'

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
        missingSubscription: false,
        careUnits: [
          {
            unitId: '1234a',
            unitName: 'Care unit 1',
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
          {
            unitId: '1234c',
            unitName: 'Care unit 2',
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

export const getUserWithLaunchId = (): User => {
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
    launchId: '97f279ba-7d2b-4b0a-8665-7adde08f26f4',
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
        missingSubscription: false,
        careUnits: [
          {
            unitId: '1234a',
            unitName: 'Care unit 1',
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
          {
            unitId: '1234c',
            unitName: 'Care unit 2',
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
        missingSubscription: false,
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
        missingSubscription: false,
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
        missingSubscription: false,
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

export const getUserWithMissingSubscription = (): User => {
  const unit: Unit = {
    unitId: '1234',
    unitName: 'Care Provider',
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
        id: '1234',
        name: 'Care Provider',
        missingSubscription: true,
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

const createUnitStatistic = (): UnitStatistic => ({
  draftsOnUnit: 3,
  questionsOnUnit: 0,
  draftsOnSubUnits: 1,
  questionsOnSubUnits: 5,
})

const createUserStatistics = (statistics: UnitStatistics, totalDraftsAndUnhandledQuestionsOnOtherUnits = 17): UserStatistics => ({
  nbrOfDraftsOnSelectedUnit: 6,
  nbrOfUnhandledQuestionsOnSelectedUnit: 10,
  totalDraftsAndUnhandledQuestionsOnOtherUnits,
  unitStatistics: statistics,
})

export const getUserStatistics = (): UserStatistics => {
  const unitStatistics: UnitStatistics = {
    '1234a': createUnitStatistic(),
    '1234b': createUnitStatistic(),
    '1234c': createUnitStatistic(),
  }

  return createUserStatistics(unitStatistics)
}

export const getUserStatisticsWithNoDraftsOnOtherUnits = (): UserStatistics => {
  const unitStatistics: UnitStatistics = {
    '1234a': createUnitStatistic(),
    '1234b': createUnitStatistic(),
  }

  return createUserStatistics(unitStatistics, 0)
}

export const getUserStatisticsForOneCareUnit = (): UserStatistics => {
  const unitStatistics: UnitStatistics = {
    '1234a': createUnitStatistic(),
  }

  return createUserStatistics(unitStatistics)
}

export const getChooseUnitResourceLink = (): ResourceLink[] => {
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

export const getChangeUnitResourceLink = (): ResourceLink[] => {
  return [
    {
      type: ResourceLinkType.CHANGE_UNIT,
      name: 'Byt vårdenhet',
      body: '',
      description: '',
      enabled: true,
    },
  ]
}

export const getPrivatePractitionerPortalResourceLink = (): ResourceLink[] => {
  return [
    {
      type: ResourceLinkType.PRIVATE_PRACTITIONER_PORTAL,
      name: 'Min sida',
      body: '',
      description: '',
      enabled: true,
    },
  ]
}

export const getSubscriptionWarningResourceLink = (): ResourceLink[] => {
  return [
    {
      type: ResourceLinkType.SUBSCRIPTION_WARNING,
      name: 'Saknar avtal',
      body: '',
      description: '',
      enabled: true,
    },
  ]
}

export const getNavigateBackButtonLink = (): ResourceLink[] => {
  return [
    {
      type: ResourceLinkType.NAVIGATE_BACK_BUTTON,
      name: 'Tillbaka',
      body: '',
      description: '',
      enabled: true,
    },
  ]
}

export const getUnit = (): Unit => {
  return {
    unitName: 'unitName',
    unitId: 'unitId',
    zipCode: 'zipCode',
    address: 'address',
    phoneNumber: 'phoneNumber',
    city: 'city',
    email: 'email',
    isInactive: false,
  }
}
