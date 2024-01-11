import { addDays } from 'date-fns'
import { expect, it, describe } from 'vitest'
import { fakeCertificateConfig } from './faker/fakeCertificateConfig'
import { fakeCauseOfDeathElement, fakeRadioBooleanElement } from './faker/fakeCertificateData'
import { fakeCertificateValue } from './faker/fakeCertificateValue'
import { getBooleanElement, getCertificate, getDateElement, getTextElement } from './test/certificateTestUtil'
import {
  autoFillElement,
  decorateCertificateWithInitialValues,
  getValidationErrors,
  isShowAlways,
  parseExpression,
  validateExpressions,
} from './validationUtils'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigTypes,
  ConfigUeCheckboxMultipleCodes,
  fakeCertificateDataValidation,
  formatDateToString,
  getDateRangeElement,
  getIcfElement,
  getSickLeavePeriodElement,
  ResourceLink,
  ResourceLinkType,
  ValidationError,
  ValueBoolean,
  ValueCode,
  ValueDate,
  ValueDateList,
  ValueDateRange,
  ValueDateRangeList,
  ValueIcf,
  ValueText,
  ValueUncertainDate,
} from '..'

const getValidationError = (type: string): ValidationError => ({
  id: 'id',
  type,
  field: 'field',
  category: 'category',
  text: 'text',
})

describe('Validate mandatory rule for boolean values', () => {
  const booleanElement = getBooleanElement()

  it('should validate as false when selected is null', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = null
    const result = parseExpression('exists($harFunktionsnedsattning)', booleanElement)
    expect(result).toBe(false)
  })

  it('should validate as true when selected is false', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = false
    const result = parseExpression('exists($harFunktionsnedsattning)', booleanElement)
    expect(result).toBe(true)
  })

  it('should validate as true when selected is true', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = true
    const result = parseExpression('exists($harFunktionsnedsattning)', booleanElement)
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for text values', () => {
  const textElement = getTextElement()

  it('should validate as false when text is null', () => {
    const valueText = textElement.value as ValueText
    valueText.text = null
    const result = parseExpression('$funktionsnedsattning', textElement)
    expect(result).toBe(false)
  })

  it('should validate as false when text is empty', () => {
    const valueText = textElement.value as ValueText
    valueText.text = ''
    const result = parseExpression('$funktionsnedsattning', textElement)
    expect(result).toBe(false)
  })

  it('should validate as true when text is at least one character long', () => {
    const valueText = textElement.value as ValueText
    valueText.text = 'Här är en text'
    const result = parseExpression('$funktionsnedsattning', textElement)
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for icf values', () => {
  const icfElement = getIcfElement()

  it('should validate as false when text is null', () => {
    const valueIcf = icfElement.value as ValueIcf
    valueIcf.text = null
    const result = parseExpression('$funktionsnedsattning', icfElement)
    expect(result).toBe(false)
  })

  it('should validate as false when text is empty', () => {
    const valueIcf = icfElement.value as ValueIcf
    valueIcf.text = ''
    const result = parseExpression('$funktionsnedsattning', icfElement)
    expect(result).toBe(false)
  })

  it('should validate as true when text is at least one character long', () => {
    const valueIcf = icfElement.value as ValueIcf
    valueIcf.text = 'Här är en text'
    const result = parseExpression('$funktionsnedsattning', icfElement)
    expect(result).toBe(true)
  })
})

describe('Validate show rule for boolean values', () => {
  const booleanElement = getBooleanElement()

  it('should validate as false when selected is null', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = null
    const result = parseExpression('$harFunktionsnedsattning', booleanElement)
    expect(result).toBe(false)
  })

  it('should validate as false when selected is false', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = false
    const result = parseExpression('$harFunktionsnedsattning', booleanElement)
    expect(result).toBe(false)
  })

  it('should validate as true when selected is true', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = true
    const result = parseExpression('$harFunktionsnedsattning', booleanElement)
    expect(result).toBe(true)
  })
})

describe('Validate show rule for date range values for sickLeavePeriod element', () => {
  const sickLeavePeriodElement = getSickLeavePeriodElement()
  const SUT_ID = 'EN_FJARDEDEL'

  it('should validate as false when from date is less than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const fromDate = formatDateToString(new Date())
    value.list = [{ id: SUT_ID, from: fromDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.from <= -7`, sickLeavePeriodElement)
    expect(result).toBe(false)
  })

  it('should validate as false when to date is less than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const toDate = formatDateToString(new Date())
    value.list = [{ id: SUT_ID, to: toDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.to <= -7`, sickLeavePeriodElement)
    expect(result).toBe(false)
  })

  it('should validate as true when from date is greater than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const fromDate = formatDateToString(addDays(new Date(), -7))
    value.list = [{ id: SUT_ID, from: fromDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.from <= -7`, sickLeavePeriodElement)
    expect(result).toBe(true)
  })

  it('should validate as true when to date is greater than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const toDate = formatDateToString(addDays(new Date(), -7))
    value.list = [{ id: SUT_ID, to: toDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.to <= -7`, sickLeavePeriodElement)
    expect(result).toBe(true)
  })
})

describe('Validate show rule for date range values', () => {
  const dateRangeElement = getDateRangeElement()
  const SUT_ID = 'sjukskrivningsgradPeriod'

  it('should validate as false when difference from date.from & date.to is less than 14', () => {
    const value = dateRangeElement.value as ValueDateRange
    value.from = formatDateToString(new Date())
    value.to = formatDateToString(addDays(new Date(), 5))

    const result = parseExpression(`${SUT_ID}.to - ${SUT_ID}.from > 14`, dateRangeElement)
    expect(result).toBe(false)
  })

  it('should validate as true when difference from date.from & date.to is greater than 14 days', () => {
    const value = dateRangeElement.value as ValueDateRange
    value.from = formatDateToString(new Date())
    value.to = formatDateToString(addDays(new Date(), 20))

    const result = parseExpression(`${SUT_ID}.to - ${SUT_ID}.from > 14`, dateRangeElement)
    expect(result).toBe(true)
  })

  it('should validate as false when difference from date.from & date.to is equal', () => {
    const value = dateRangeElement.value as ValueDateRange
    value.from = formatDateToString(new Date())
    value.to = formatDateToString(addDays(new Date(), 14))

    const result = parseExpression(`${SUT_ID}.to - ${SUT_ID}.from > 14`, dateRangeElement)
    expect(result).toBe(false)
  })
})

describe('Validate mandatory rule for date range values', () => {
  const sickLeavePeriodElement = getSickLeavePeriodElement()
  const SUT_ID = 'EN_FJARDEDEL'

  it('should validate as false when from date is invalid', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    value.list = [{ id: SUT_ID, to: '2021-10-15', type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression('$EN_FJARDEDEL', sickLeavePeriodElement)
    expect(result).toBe(false)
  })

  it('should validate as false when to date is invalid', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    value.list = [{ id: SUT_ID, from: '2021-10-15', type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression('$EN_FJARDEDEL', sickLeavePeriodElement)
    expect(result).toBe(false)
  })

  it('should validate as true when from and to date are valid', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    value.list = [{ id: SUT_ID, from: '2021-10-15', to: '2021-10-16', type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression('$EN_FJARDEDEL', sickLeavePeriodElement)
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for date list', () => {
  const dateListElement: CertificateDataElement = {
    id: '1',
    parent: 'grundformu',
    index: 3,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: {
      text: 'Intyget är baserat på',
      description:
        'Enligt Socialstyrelsens föreskrifter (HSLF-FS 2018:54) om att utfärda intyg i hälso- och\n        sjukvården ska ett läkarintyg innehålla uppgifter om vad som ligger till grund för din bedömning vid utfärdandet\n        av intyget. Ett intyg ska som huvudregel utfärdas efter en undersökning av patienten. Intyget ska innehålla\n        uppgift om kontaktsätt vid undersökningen. Om kontaktsättet är videosamtal anger du detta under fältet Övriga\n        upplysningar.',
      type: ConfigTypes.UE_CHECKBOX_MULTIPLE_DATE,
      list: [
        {
          id: 'undersokningAvPatienten',
          label: 'min undersökning av patienten',
        },
        {
          id: 'telefonkontaktMedPatienten',
          label: 'min telefonkontakt med patienten',
        },
        {
          id: 'journaluppgifter',
          label: 'journaluppgifter från den',
        },
        {
          id: 'annatGrundForMU',
          label: 'annat',
        },
      ],
    },
    value: {
      type: CertificateDataValueType.DATE_LIST,
      list: [],
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1',
        expression: '$undersokningAvPatienten || $telefonkontaktMedPatienten || $journaluppgifter || $annatGrundForMU',
      },
    ],
    validationErrors: [],
  }

  it('should validate as false when list is empty', () => {
    const result = parseExpression(
      '$undersokningAvPatienten || $telefonkontaktMedPatienten || $journaluppgifter || $annatGrundForMU',
      dateListElement
    )
    expect(result).toBe(false)
  })

  it('should validate as true when date is set', () => {
    const value = dateListElement.value as ValueDateList
    value.list = [
      {
        id: 'undersokningAvPatienten',
        date: '2021-01-01',
        type: CertificateDataValueType.DATE,
      },
    ]
    const result = parseExpression(
      '$undersokningAvPatienten || $telefonkontaktMedPatienten || $journaluppgifter || $annatGrundForMU',
      dateListElement
    )
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for uncertain date', () => {
  const uncertainDateElement: CertificateDataElement = {
    id: '1',
    parent: 'grundformu',
    index: 3,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: fakeCertificateConfig.uncertainDate({
      text: 'Osäkert dödsdatum',
      description: 'Datum då döden inträffade är osäkert',
      id: 'osakertDodsDatum',
    }),
    value: fakeCertificateValue.uncertainDate({
      id: 'osakertDodsDatum',
    }),
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1',
        expression: '$osakertDodsDatum',
      },
    ],
    validationErrors: [],
  }

  it('should validate as false when no date is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = ''
    const result = parseExpression('uncertainDate(osakertDodsDatum)', uncertainDateElement)
    expect(result).toBe(false)
  })

  it('should validate as false when no valid date is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '0000--00'
    const result = parseExpression('uncertainDate(osakertDodsDatum)', uncertainDateElement)
    expect(result).toBe(false)
  })

  it('should validate as true when unknown year is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '0000-00-00'
    const result = parseExpression('uncertainDate(osakertDodsDatum)', uncertainDateElement)
    expect(result).toBe(true)
  })

  it('should validate as true when unknown month is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '2022-00-00'
    const result = parseExpression('uncertainDate(osakertDodsDatum)', uncertainDateElement)
    expect(result).toBe(true)
  })

  it('should validate as true when year and month are set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '2022-04-00'
    const result = parseExpression('uncertainDate(osakertDodsDatum)', uncertainDateElement)
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for cause of death', () => {
  it('Should validate as false when text is null', () => {
    const result = parseExpression(
      'dodsorsak',
      fakeCauseOfDeathElement({ id: '1', value: { description: { id: 'dodsorsak', text: null } } })[1]
    )
    expect(result).toBe(false)
  })

  it('Should validate as false when text is empty', () => {
    const result = parseExpression(
      'dodsorsak',
      fakeCauseOfDeathElement({ id: '1', value: { description: { id: 'dodsorsak', text: '' } } })[1]
    )
    expect(result).toBe(false)
  })

  it('Should validate as true when text is at least one character long', () => {
    const result = parseExpression(
      'dodsorsak',
      fakeCauseOfDeathElement({ id: '1', value: { description: { id: 'dodsorsak', text: 'Här är en text' } } })[1]
    )
    expect(result).toBe(true)
  })
})

describe('Validate multiple show rules', () => {
  const categoryElement: CertificateDataElement = {
    id: 'aktivitetsbegransning',
    parent: '',
    index: 3,
    visible: true,
    readOnly: false,
    mandatory: false,
    config: {
      text: 'Aktivitetsbegränsning',
      description: '',
      type: ConfigTypes.CATEGORY,
    },
    validation: [
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    value: null,
    validationErrors: [],
  }

  const booleanElement: CertificateDataElement = {
    id: '2.1',
    parent: 'aktivitetsbegransning',
    index: 4,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: fakeCertificateConfig.radioBoolean({
      text: 'Leder funktionsnedsättningarna till aktivitetsbegränsningar i relation till arbete eller studier?',
      description:
        'Aktivitet innebär personens möjlighet att genomföra en uppgift eller handling. Aktivitetsbegränsning ska bedömas utifrån de begränsningar personen har kopplat till att kunna söka arbete, genomföra en arbetsuppgift/arbetsuppgifter, kunna studera eller delta i aktivitet hos Arbetsförmedlingen.',
      type: ConfigTypes.UE_RADIO_BOOLEAN,
      id: 'harAktivitetsbegransning',
      selectedText: 'Ja',
      unselectedText: 'Nej',
    }),
    value: {
      type: CertificateDataValueType.BOOLEAN,
      id: 'harAktivitetsbegransning',
      selected: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '2.1',
        expression: '$harAktivitetsbegransning',
      },
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }

  const textElement: CertificateDataElement = {
    id: '2.2',
    parent: '2.1',
    index: 5,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: fakeCertificateConfig.textArea({
      text: 'Ange vilka aktivitetsbegränsningar? Ange hur och om möjligt varaktighet/prognos.',
      description:
        'Ge konkreta exempel på aktivitetsbegränsningar utifrån personens planerade insatser hos Arbetsförmedlingen eller personens möjlighet att söka arbete, genomföra en arbetsuppgift/arbetsuppgifter eller studera. Till exempel:\n\natt ta till sig en instruktion\natt ta reda på och förstå muntlig eller skriftlig information\natt kunna fokusera\natt kunna bära eller lyfta\natt kunna hantera statiskt arbete',
      id: 'aktivitetsbegransning',
    }),
    value: {
      type: CertificateDataValueType.TEXT,
      id: 'aktivitetsbegransning',
      text: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '2.2',
        expression: '$aktivitetsbegransning',
      },
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '2.1',
        expression: '$harAktivitetsbegransning',
      },
      {
        type: CertificateDataValidationType.SHOW_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }

  const updatedElement: CertificateDataElement = {
    id: '1.1',
    parent: 'funktionsnedsattning',
    index: 1,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: fakeCertificateConfig.radioBoolean({
      text: 'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
      description: 'Med besvär avses sådant som påverkar psykiska, psykosociala eller kroppsliga funktioner.',
      id: 'harFunktionsnedsattning',
      selectedText: 'Ja',
      unselectedText: 'Nej',
    }),
    value: {
      type: CertificateDataValueType.BOOLEAN,
      id: 'harFunktionsnedsattning',
      selected: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1.1',
        expression: '$harFunktionsnedsattning',
      },
    ],
    validationErrors: [],
  }

  const certificate: Certificate = {
    metadata: {
      id: 'bed26d3e-7112-4f08-98bf-01be40e26c80',
      type: 'af00213',
      typeVersion: '1.0',
      name: 'Arbetsförmedlingens medicinska utlåtande',
      description:
        'Arbetsförmedlingen behöver ett medicinskt utlåtande för en arbetssökande som har ett behov av fördjupat stöd.\n\nVi behöver ett utlåtande för att kunna:\n\n• utreda och bedöma om den arbetssökande har en funktionsnedsättning som medför nedsatt arbetsförmåga\n• bedöma om vi behöver göra anpassningar i program eller insatser\n• erbjuda lämpliga utredande, vägledande, rehabiliterande eller arbetsförberedande insatser.',
      status: CertificateStatus.UNSIGNED,
      created: '2020-10-12T15:31:37.632',
      testCertificate: false,
      forwarded: false,
      sent: false,
      latestMajorVersion: true,
      responsibleHospName: 'responsibleHospName',
      relations: {
        children: [],
        parent: null,
      },
      unit: {
        unitId: 'TSTNMT2321000156-1077',
        unitName: 'NMT vg3 ve1',
        address: 'NMT gata 3',
        zipCode: '12345',
        city: 'Testhult',
        phoneNumber: '0101112131416',
        email: 'enhet3@webcert.invalid.se',
        isInactive: false,
      },
      careUnit: {
        unitId: 'TSTNMT2321000156-1077',
        unitName: 'NMT vg3 ve1',
        address: 'NMT gata 3',
        zipCode: '12345',
        city: 'Testhult',
        phoneNumber: '0101112131416',
        email: 'enhet3@webcert.invalid.se',
        isInactive: false,
      },
      careProvider: {
        unitId: 'TSTNMT2321000156-102Q',
        unitName: 'NMT vg3',
        address: 'NMT gata 3',
        zipCode: '12345',
        city: 'Testhult',
        phoneNumber: '0101112131416',
        email: 'enhet3@webcert.invalid.se',
        isInactive: false,
      },
      patient: {
        personId: {
          id: '191212121212',
          type: 'Personnummer',
        },
        differentNameFromEHR: false,
        personIdChanged: false,
        firstName: 'Tolvan',
        lastName: 'Tolvansson',
        fullName: 'Tolvan Tolvansson',
        street: 'Street 1',
        zipCode: '12345',
        city: 'City',
        coordinationNumber: false,
        testIndicated: false,
        protectedPerson: false,
        deceased: false,
        reserveId: false,
      },
      issuedBy: {
        personId: 'TSTNMT2321000156-1079',
        fullName: 'Arnold Johansson',
        prescriptionCode: '0000000',
      },
      version: 0,
    },
    data: {
      [updatedElement.id]: updatedElement,
      [categoryElement.id]: categoryElement,
      [booleanElement.id]: booleanElement,
      [textElement.id]: textElement,
    },
    links: [],
  }

  it('should validate as false if both show rules are false', () => {
    const validationResults = validateExpressions(certificate, updatedElement)

    const categoryResult = validationResults.find(
      (validationResult) =>
        validationResult.id === categoryElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    const booleanResult = validationResults.find(
      (validationResult) =>
        validationResult.id === booleanElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    const textResult = validationResults.find(
      (validationResult) =>
        validationResult.id === textElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    expect(categoryResult === undefined ? undefined : categoryResult.result).toBe(false)
    expect(booleanResult === undefined ? undefined : booleanResult.result).toBe(false)
    expect(textResult === undefined ? undefined : textResult.result).toBe(false)
  })

  it('should validate as true if one show rule is true and the other false', () => {
    const valueBoolean = updatedElement.value as ValueBoolean
    valueBoolean.selected = true

    const validationResults = validateExpressions(certificate, updatedElement)

    const categoryResult = validationResults.find(
      (validationResult) =>
        validationResult.id === categoryElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    const booleanResult = validationResults.find(
      (validationResult) =>
        validationResult.id === booleanElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    const textResult = validationResults.find(
      (validationResult) =>
        validationResult.id === textElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    expect(categoryResult === undefined ? undefined : categoryResult.result).toBe(true)
    expect(booleanResult === undefined ? undefined : booleanResult.result).toBe(true)
    expect(textResult === undefined ? undefined : textResult.result).toBe(true)
  })

  it('should validate as true if both show rules are true', () => {
    const updatedValueBoolean = updatedElement.value as ValueBoolean
    updatedValueBoolean.selected = true

    const booleanValueBoolean = booleanElement.value as ValueBoolean
    booleanValueBoolean.selected = true

    const validationResults = validateExpressions(certificate, updatedElement)

    const categoryResult = validationResults.find(
      (validationResult) =>
        validationResult.id === categoryElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    const booleanResult = validationResults.find(
      (validationResult) =>
        validationResult.id === booleanElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    const textResult = validationResults.find(
      (validationResult) =>
        validationResult.id === textElement.id && validationResult.type === CertificateDataValidationType.SHOW_VALIDATION
    )

    expect(categoryResult === undefined ? undefined : categoryResult.result).toBe(true)
    expect(booleanResult === undefined ? undefined : booleanResult.result).toBe(true)
    expect(textResult === undefined ? undefined : textResult.result).toBe(true)
  })
})

describe('Validate enable rule for code values', () => {
  const codeElement: CertificateDataElement = {
    id: '39.1',
    parent: 'bedomning',
    index: 25,
    visible: true,
    readOnly: false,
    mandatory: true,
    disabled: true,
    config: {
      text: '',
      description: '',
      type: ConfigTypes.UE_DROPDOWN,
      list: [
        {
          id: 'VALJ_TIDSPERIOD',
          label: 'Välj tidsperiod',
        },
        {
          id: 'TRETTIO_DGR',
          label: '1 månad.',
        },
        {
          id: 'SEXTIO_DGR',
          label: '2 månader.',
        },
        {
          id: 'NITTIO_DGR',
          label: '3 månader.',
        },
        {
          id: 'HUNDRAATTIO_DAGAR',
          label: '6 månader.',
        },
        {
          id: 'TREHUNDRASEXTIOFEM_DAGAR',
          label: '12 månader.',
        },
      ],
    },
    value: fakeCertificateValue.code(),
    validation: [
      {
        type: CertificateDataValidationType.ENABLE_VALIDATION,
        questionId: '39',
        expression: '$ATER_X_ANTAL_DGR',
      },
    ],
    validationErrors: [],
  }

  it('should validate as false when code is not set', () => {
    const value = codeElement.value as ValueCode
    value.code = ''
    const result = parseExpression('$ATER_X_ANTAL_DGR', codeElement)
    expect(result).toBe(false)
  })

  it('should validate as true when code is set', () => {
    const value = codeElement.value as ValueCode
    value.id = 'ATER_X_ANTAL_DGR'
    value.code = 'ATER_X_ANTAL_DGR'
    const result = parseExpression('$ATER_X_ANTAL_DGR', codeElement)
    expect(result).toBe(true)
  })
})

describe('Set initial values to a certificate', () => {
  const certificate = getCertificate()

  it('Shall set mandatory to true on boolean element if empty', () => {
    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(true)
  })

  it('Shall set mandatory to true on boolean element if undefined', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    // Test when selected is undefined when arriving from backend.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    booleanValue.selected = undefined

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(true)
  })

  it('Shall set mandatory to false on boolean element if it is true', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(false)
  })

  it('Shall set mandatory to false on boolean element if it is false', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(false)
  })

  it('Shall set visible to false on boolean element if empty', () => {
    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(false)
  })

  it('Shall set visible to false on boolean element if undefined', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    // Test when selected is undefined when arriving from backend.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    booleanValue.selected = undefined

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(false)
  })

  it('Shall set visible to true on boolean element if it is true', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(true)
  })

  it('Shall set visible to false on boolean element if it is false', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(false)
  })

  it('Shall set visible to false if show rule not valid, even if hide rule is not valid', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.3'].visible).toBe(false)
  })

  it('Shall set visible to true if show rule valid, even if hide rule is not valid', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    certificate.data['1.2'].visible = true // Set it visible as default
    certificate.data['1.2'].validation = [] // Clear the validations so they don't affect this test.
    const textValue: ValueText = certificate.data['1.2'].value as ValueText
    textValue.text = 'A little text'

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.3'].visible).toBe(true)
  })

  it('Shall set visible to false if hide rule valid, even if show rule is valid', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    const textValue: ValueText = certificate.data['1.2'].value as ValueText
    textValue.text = 'A little text'

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.3'].visible).toBe(false)
  })

  it('should set highlight if validation is true', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].style).toBe(CertificateDataElementStyleEnum.HIGHLIGHTED)
  })

  it('should unstyle element if validation is false', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].style).toBe(CertificateDataElementStyleEnum.NORMAL)
  })

  it('should disable child element if validation is true', () => {
    decorateCertificateWithInitialValues(certificate)

    expect((certificate.data['28'].config as ConfigUeCheckboxMultipleCodes).list[1].disabled).toBeTruthy()
  })

  it('should enable child element if validation is false', () => {
    decorateCertificateWithInitialValues(certificate)

    expect((certificate.data['28'].config as ConfigUeCheckboxMultipleCodes).list[0].disabled).toBeFalsy()
  })

  describe('Intialize values for autoFill validation', () => {
    const cert = getCertificate()

    it('should autoFill value if validation is true', () => {
      const booleanValue: ValueBoolean = cert.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      decorateCertificateWithInitialValues(cert)

      expect((cert.data['1.2'].value as ValueText).text).toBe('Detta är autoifyllt!')
    })

    it('should not autoFill value if validation is false', () => {
      const booleanValue: ValueBoolean = cert.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      decorateCertificateWithInitialValues(cert)

      expect((cert.data['1.3'].value as ValueText).text).toBe(null)
    })
  })

  describe('Intialize values when certificate is not UNSIGNED', () => {
    const cert = getCertificate()

    const clearValues = () => {
      cert.data = Object.fromEntries(
        Object.entries(cert.data).map(([id, question]) => [
          id,
          {
            ...question,
            value: null,
            readOnly: false,
            disabled: false,
          },
        ])
      )
    }

    it('Shall set all data elements as disabled when certificate is LOCKED but still validate rules', () => {
      const booleanValue: ValueBoolean = cert.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      cert.metadata.status = CertificateStatus.LOCKED

      decorateCertificateWithInitialValues(cert)

      expect(cert.data['1.1'].disabled).toBe(true)
      expect(cert.data['1.1'].visible).toBe(true)
      expect(cert.data['1.2'].disabled).toBe(true)
      expect(cert.data['1.2'].visible).toBe(true)
      expect(cert.data['1.3'].disabled).toBe(true)
      expect(cert.data['1.3'].visible).toBe(false)
    })

    it('Shall set all data elements as disabled when certificate is LOCKED_REVOKED but still validate rules', () => {
      const booleanValue: ValueBoolean = cert.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      cert.metadata.status = CertificateStatus.LOCKED_REVOKED

      decorateCertificateWithInitialValues(cert)

      expect(cert.data['1.1'].disabled).toBe(true)
      expect(cert.data['1.1'].visible).toBe(true)
      expect(cert.data['1.2'].disabled).toBe(true)
      expect(cert.data['1.2'].visible).toBe(true)
      expect(cert.data['1.3'].disabled).toBe(true)
      expect(cert.data['1.3'].visible).toBe(false)
    })

    it('Shall set all data elements as readOnly when certificate is SIGNED', () => {
      clearValues()
      cert.metadata.status = CertificateStatus.SIGNED

      decorateCertificateWithInitialValues(cert)

      expect(cert.data['1.1'].readOnly).toBe(true)
      expect(cert.data['1.2'].readOnly).toBe(true)
      expect(cert.data['1.1'].visible).toBe(true)
      expect(cert.data['1.2'].visible).toBe(true)
    })

    it('Shall set all data elements as readOnly when certificate is REVOKED', () => {
      clearValues()
      cert.metadata.status = CertificateStatus.REVOKED

      decorateCertificateWithInitialValues(cert)

      expect(cert.data['1.1'].readOnly).toBe(true)
      expect(cert.data['1.2'].readOnly).toBe(true)
      expect(cert.data['1.1'].visible).toBe(true)
      expect(cert.data['1.2'].visible).toBe(true)
    })
  })

  it('should return validation errors from field', () => {
    const validationError: ValidationError = { id: '', category: '', field: 'grunddata.skapadAv.vardenhet.postadress', type: '', text: '' }
    const validationErrors: ValidationError[] = []
    validationErrors.push(validationError)

    const result = getValidationErrors(validationErrors, 'grunddata.skapadAv.vardenhet.postadress')

    expect(result.length).toBe(1)
    expect(result[0].field).toBe('grunddata.skapadAv.vardenhet.postadress')
  })

  it('should return empty array on non existing field', () => {
    const validationError: ValidationError = { id: '', category: '', field: 'grunddata.skapadAv.vardenhet.postadress', type: '', text: '' }
    const validationErrors: ValidationError[] = []
    validationErrors.push(validationError)

    const result = getValidationErrors(validationErrors, 'NON_EXISTING_FIELD')

    expect(result.length).toBe(0)
  })

  it('should disable all categories if no edit link', () => {
    const cert = getCertificate()

    decorateCertificateWithInitialValues(cert)

    Object.values(cert.data).forEach((data) => {
      expect(data.disabled).toBe(true)
    })
  })

  it('should not disable all categories if there is an edit link', () => {
    const editLink: ResourceLink = {
      type: ResourceLinkType.EDIT_CERTIFICATE,
      name: '',
      description: '',
      enabled: false,
    }
    const cert = getCertificate({ links: [editLink] })

    decorateCertificateWithInitialValues(cert)

    Object.values(cert.data).forEach((data) => {
      expect(data.disabled).toBeFalsy()
    })
  })
})

describe('isShowAlways', () => {
  it('should return true if validation error is of type OTHER', () => {
    const result = isShowAlways(getValidationError('OTHER'))
    expect(result).toBeTruthy()
  })

  it('should return true if validation error is of type INVALID_FORMAT', () => {
    const result = isShowAlways(getValidationError('INVALID_FORMAT'))
    expect(result).toBeTruthy()
  })

  it('should return false if validation error is of other type than other or invalid format', () => {
    const result = isShowAlways(getValidationError('TEST'))
    expect(result).toBeFalsy()
  })
})

describe('Validate expressions based on DateValue', () => {
  const element = getDateElement()

  it('should return true if date has a value', () => {
    ;(element.value as ValueDate).date = '2022-01-01'
    const result = parseExpression('$dodsdatum', element)
    expect(result).toBe(true)
  })

  it('should return false if date is missing a value', () => {
    ;(element.value as ValueDate).date = undefined
    const result = parseExpression('$dodsdatum', element)
    expect(result).toBe(false)
  })

  it('should return true if EpochDay is within 28 days', () => {
    ;(element.value as ValueDate).date = '2022-01-01' // 18993
    const result = parseExpression('epochDay($dodsdatum) <= 19013', element)
    expect(result).toBe(true)
  })

  it('should return false if EpochDay is not within 28 days', () => {
    ;(element.value as ValueDate).date = '2022-01-01' // 18993
    const result = parseExpression('epochDay($dodsdatum) <= 18992', element)
    expect(result).toBe(false)
  })
  it('should return false if EpochDay is not set', () => {
    ;(element.value as ValueDate).date = undefined
    const result = parseExpression('epochDay($dodsdatum) > 18992', element)
    expect(result).toBe(false)
  })
})

describe('Validate expressions only when visible', () => {
  const element = getDateElement()

  it('should return true if date has a value and element is visible', () => {
    ;(element.value as ValueDate).date = '2022-01-01'
    element.visible = true
    const result = parseExpression('$dodsdatum', element)
    expect(result).toBe(true)
  })

  it('should return false if date has a value and element is not visible', () => {
    ;(element.value as ValueDate).date = '2022-01-01'
    element.visible = false
    const result = parseExpression('$dodsdatum', element)
    expect(result).toBe(false)
  })
})

describe('autoFillElement', () => {
  it('Should handle boolean values', () => {
    const radioBooleanElement = fakeRadioBooleanElement({ id: '1', value: { selected: true } })['1']
    expect((radioBooleanElement.value as ValueBoolean).selected).toEqual(true)

    autoFillElement(
      fakeCertificateDataValidation({
        type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
        fillValue: {
          type: CertificateDataValueType.BOOLEAN,
          selected: false,
        },
      }),
      radioBooleanElement
    )

    expect((radioBooleanElement.value as ValueBoolean).selected).toEqual(false)

    autoFillElement(
      fakeCertificateDataValidation({
        type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
        fillValue: {
          type: CertificateDataValueType.BOOLEAN,
          selected: true,
        },
      }),
      radioBooleanElement
    )

    expect((radioBooleanElement.value as ValueBoolean).selected).toEqual(true)
  })
})

describe('Validate expressions with boolean values set to null or undefined should not be showed', () => {
  const element = getBooleanElement()

  it('should return true if selected is undefined for negative expression', () => {
    ;(element.value as ValueBoolean).selected = undefined
    const result = parseExpression('!$dodsdatumSakert', element)
    expect(result).toBe(true)
  })
  it('should return false if selected is undefined for positive expression', () => {
    ;(element.value as ValueBoolean).selected = undefined
    const result = parseExpression('$dodsdatumSakert', element)
    expect(result).toBe(false)
  })
  it('should return true if selected is null for negative expression', () => {
    ;(element.value as ValueBoolean).selected = null
    const result = parseExpression('!$dodsdatumSakert', element)
    expect(result).toBe(true)
  })
  it('should return false if selected is null for positive expression', () => {
    ;(element.value as ValueBoolean).selected = null
    const result = parseExpression('$dodsdatumSakert', element)
    expect(result).toBe(false)
  })
})
