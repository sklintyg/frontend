import { addDays } from 'date-fns'
import {
  Certificate,
  CertificateDataElement,
  CertificateDataElementStyleEnum,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigTypes,
  ConfigUeCheckboxMultipleCodes,
  fakeCertificate,
  fakeCertificateDataValidation,
  fakeCheckboxMultipleCodeElement,
  formatDateToString,
  ResourceLinkType,
  ValidationError,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDateList,
  ValueDateRange,
  ValueDateRangeList,
  ValueIcf,
  ValueText,
  ValueUncertainDate,
} from '..'
import { fakeCertificateConfig } from './faker/fakeCertificateConfig'
import {
  fakeCategoryElement,
  fakeCauseOfDeathElement,
  fakeCheckboxCodeElement,
  fakeDateElement,
  fakeDateRangeElement,
  fakeICFDataElement,
  fakeRadioBooleanElement,
  fakeSickLeavePeriod,
  fakeTextFieldElement,
} from './faker/fakeCertificateData'
import { fakeCertificateValue } from './faker/fakeCertificateValue'
import {
  autoFillElement,
  decorateCertificateWithInitialValues,
  getValidationErrors,
  isShowAlways,
  parseExpression,
  validateExpressions,
} from './validationUtils'

describe('Validate mandatory rule for boolean values', () => {
  const booleanElement = fakeRadioBooleanElement({ id: 'id' })['id']

  it('it should validate as false when selected is null', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = null
    const result = parseExpression('$harFunktionsnedsattning', booleanElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when selected is false', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = false
    const result = parseExpression('$harFunktionsnedsattning', booleanElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as true when selected is true', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = true
    const result = parseExpression('$harFunktionsnedsattning', booleanElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for text values', () => {
  const textElement = fakeTextFieldElement({ id: 'id' })['id']

  it('it should validate as false when text is null', () => {
    const valueText = textElement.value as ValueText
    valueText.text = null
    const result = parseExpression('$funktionsnedsattning', textElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as false when text is empty', () => {
    const valueText = textElement.value as ValueText
    valueText.text = ''
    const result = parseExpression('$funktionsnedsattning', textElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when text is at least one character long', () => {
    const valueText = textElement.value as ValueText
    valueText.text = 'Här är en text'
    const result = parseExpression('$funktionsnedsattning', textElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for icf values', () => {
  const icfElement = fakeICFDataElement({ id: 'id' })['id']

  it('it should validate as false when text is null', () => {
    const valueIcf = icfElement.value as ValueIcf
    valueIcf.text = null
    const result = parseExpression('$funktionsnedsattning', icfElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as false when text is empty', () => {
    const valueIcf = icfElement.value as ValueIcf
    valueIcf.text = ''
    const result = parseExpression('$funktionsnedsattning', icfElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when text is at least one character long', () => {
    const valueIcf = icfElement.value as ValueIcf
    valueIcf.text = 'Här är en text'
    const result = parseExpression('$funktionsnedsattning', icfElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(true)
  })
})

describe('Validate show rule for boolean values', () => {
  const booleanElement = fakeRadioBooleanElement({ id: 'id' })['id']

  it('it should validate as false when selected is null', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = null
    const result = parseExpression('$harFunktionsnedsattning', booleanElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as false when selected is false', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = false
    const result = parseExpression('$harFunktionsnedsattning', booleanElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when selected is true', () => {
    const value = booleanElement.value as ValueBoolean
    value.selected = true
    const result = parseExpression('$harFunktionsnedsattning', booleanElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(true)
  })
})

describe('Validate show rule for date range values for sickLeavePeriod element', () => {
  const sickLeavePeriodElement = fakeSickLeavePeriod({ id: 'id' })['id']
  const SUT_ID = 'EN_FJARDEDEL'

  it('it should validate as false when from date is less than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const fromDate = formatDateToString(new Date())
    value.list = [{ id: SUT_ID, from: fromDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.from <= -7`, sickLeavePeriodElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as false when to date is less than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const toDate = formatDateToString(new Date())
    value.list = [{ id: SUT_ID, to: toDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.to <= -7`, sickLeavePeriodElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when from date is greater than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const fromDate = formatDateToString(addDays(new Date(), -7))
    value.list = [{ id: SUT_ID, from: fromDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.from <= -7`, sickLeavePeriodElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as true when to date is greater than -7 days from todays date', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    const toDate = formatDateToString(addDays(new Date(), -7))
    value.list = [{ id: SUT_ID, to: toDate, type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression(`$${SUT_ID}.to <= -7`, sickLeavePeriodElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(true)
  })
})

describe('Validate show rule for date range values', () => {
  const dateRangeElement = fakeDateRangeElement({ id: 'id' })['id']
  const SUT_ID = 'sjukskrivningsgradPeriod'

  it('it should validate as false when difference from date.from & date.to is less than 14', () => {
    const value = dateRangeElement.value as ValueDateRange
    value.from = formatDateToString(new Date())
    value.to = formatDateToString(addDays(new Date(), 5))

    const result = parseExpression(`${SUT_ID}.to - ${SUT_ID}.from > 14`, dateRangeElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when difference from date.from & date.to is greater than 14 days', () => {
    const value = dateRangeElement.value as ValueDateRange
    value.from = formatDateToString(new Date())
    value.to = formatDateToString(addDays(new Date(), 20))

    const result = parseExpression(`${SUT_ID}.to - ${SUT_ID}.from > 14`, dateRangeElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as false when difference from date.from & date.to is equal', () => {
    const value = dateRangeElement.value as ValueDateRange
    value.from = formatDateToString(new Date())
    value.to = formatDateToString(addDays(new Date(), 14))

    const result = parseExpression(`${SUT_ID}.to - ${SUT_ID}.from > 14`, dateRangeElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })
})

describe('Validate mandatory rule for date range values', () => {
  const sickLeavePeriodElement = fakeSickLeavePeriod({ id: 'id' })['id']
  const SUT_ID = 'EN_FJARDEDEL'

  it('it should validate as false when from date is invalid', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    value.list = [{ id: SUT_ID, to: '2021-10-15', type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression('$EN_FJARDEDEL', sickLeavePeriodElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as false when to date is invalid', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    value.list = [{ id: SUT_ID, from: '2021-10-15', type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression('$EN_FJARDEDEL', sickLeavePeriodElement, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when from and to date are valid', () => {
    const value = sickLeavePeriodElement.value as ValueDateRangeList
    value.list = [{ id: SUT_ID, from: '2021-10-15', to: '2021-10-16', type: CertificateDataValueType.DATE_RANGE }]
    const result = parseExpression('$EN_FJARDEDEL', sickLeavePeriodElement, CertificateDataValidationType.SHOW_VALIDATION)
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

  it('it should validate as false when list is empty', () => {
    const result = parseExpression(
      '$undersokningAvPatienten || $telefonkontaktMedPatienten || $journaluppgifter || $annatGrundForMU',
      dateListElement,
      CertificateDataValidationType.MANDATORY_VALIDATION
    )
    expect(result).toBe(false)
  })

  it('it should validate as true when date is set', () => {
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
      dateListElement,
      CertificateDataValidationType.MANDATORY_VALIDATION
    )
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for uncertain datet', () => {
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

  it('it should validate as false when no date is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = ''
    const result = parseExpression('$osakertDodsDatum', uncertainDateElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as false when no valid date is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '0000--00'
    const result = parseExpression('$osakertDodsDatum', uncertainDateElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when unknown year is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '0000-00-00'
    const result = parseExpression('$osakertDodsDatum', uncertainDateElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as true when unknown month is set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '2022-00-00'
    const result = parseExpression('$osakertDodsDatum', uncertainDateElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as true when year and month are set', () => {
    const value = uncertainDateElement.value as ValueUncertainDate
    value.value = '2022-04-00'
    const result = parseExpression('$osakertDodsDatum', uncertainDateElement, CertificateDataValidationType.MANDATORY_VALIDATION)
    expect(result).toBe(true)
  })
})

describe('Validate mandatory rule for cause of death', () => {
  it('Should validate as false when text is null', () => {
    const result = parseExpression(
      'dodsorsak',
      fakeCauseOfDeathElement({ id: '1', value: { description: { id: 'dodsorsak', text: null } } })[1],
      CertificateDataValidationType.MANDATORY_VALIDATION
    )
    expect(result).toBe(false)
  })

  it('Should validate as false when text is empty', () => {
    const result = parseExpression(
      'dodsorsak',
      fakeCauseOfDeathElement({ id: '1', value: { description: { id: 'dodsorsak', text: '' } } })[1],
      CertificateDataValidationType.MANDATORY_VALIDATION
    )
    expect(result).toBe(false)
  })

  it('Should validate as true when text is at least one character long', () => {
    const result = parseExpression(
      'dodsorsak',
      fakeCauseOfDeathElement({ id: '1', value: { description: { id: 'dodsorsak', text: 'Här är en text' } } })[1],
      CertificateDataValidationType.MANDATORY_VALIDATION
    )
    expect(result).toBe(true)
  })
})

describe('Validate disable rule for code list', () => {
  const codeListElement: CertificateDataElement = {
    id: '40',
    parent: 'atgarder',
    index: 27,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: {
      text: 'Här kan du ange åtgärder som du tror skulle göra det lättare för patienten att återgå i arbete',
      description: '',
      type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
      list: [
        {
          id: 'EJ_AKTUELLT',
          label: 'Inte aktuellt',
        },
        {
          id: 'ARBETSTRANING',
          label: 'Arbetsträning',
        },
        {
          id: 'ARBETSANPASSNING',
          label: 'Arbetsanpassning',
        },
        {
          id: 'SOKA_NYTT_ARBETE',
          label: 'Söka nytt arbete',
        },
        {
          id: 'BESOK_ARBETSPLATS',
          label: 'Besök på arbetsplatsen',
        },
        {
          id: 'ERGONOMISK',
          label: 'Ergonomisk bedömning',
        },
        {
          id: 'HJALPMEDEL',
          label: 'Hjälpmedel',
        },
        {
          id: 'KONFLIKTHANTERING',
          label: 'Konflikthantering',
        },
        {
          id: 'KONTAKT_FHV',
          label: 'Kontakt med företagshälsovård',
        },
        {
          id: 'OMFORDELNING',
          label: 'Omfördelning av arbetsuppgifter',
        },
        {
          id: 'OVRIGA_ATGARDER',
          label: 'Övrigt',
        },
      ],
    },
    value: {
      type: CertificateDataValueType.CODE_LIST,
      list: [],
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '40',
        expression:
          '$EJ_AKTUELLT || $ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
      },
      {
        type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
        questionId: '40',
        expression:
          '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
        id: ['EJ_AKTUELLT'],
      },
      {
        type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
        questionId: '40',
        expression: '$EJ_AKTUELLT',
        id: [
          'ARBETSTRANING',
          'ARBETSANPASSNING',
          'SOKA_NYTT_ARBETE',
          'BESOK_ARBETSPLATS',
          'ERGONOMISK',
          'HJALPMEDEL',
          'KONFLIKTHANTERING',
          'KONTAKT_FHV',
          'OMFORDELNING',
          'OVRIGA_ATGARDER',
        ],
      },
    ],
    validationErrors: [],
  }

  it('it should validate as true when code is in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'EJ_AKTUELLT', id: 'EJ_AKTUELLT' })
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as false when code is not in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list = []
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true if several codes are chosen', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ERGONOMISK', id: 'ERGONOMISK' })
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ARBETSANPASSNING', id: 'ARBETSANPASSNING' })
    const result = parseExpression(
      '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS || $ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
      codeListElement,
      CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION
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

  it('It should validate as false if both show rules are false', () => {
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

  it('It should validate as true if one show rule is true and the other false', () => {
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

  it('It should validate as true if both show rules are true', () => {
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

  it('it should validate as false when code is not set', () => {
    const value = codeElement.value as ValueCode
    value.code = ''
    const result = parseExpression('$ATER_X_ANTAL_DGR', codeElement, CertificateDataValidationType.ENABLE_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true when code is set', () => {
    const value = codeElement.value as ValueCode
    value.id = 'ATER_X_ANTAL_DGR'
    value.code = 'ATER_X_ANTAL_DGR'
    const result = parseExpression('$ATER_X_ANTAL_DGR', codeElement, CertificateDataValidationType.ENABLE_VALIDATION)
    expect(result).toBe(true)
  })
})

describe('Validate disable rule for code list', () => {
  const codeListElement = fakeCheckboxMultipleCodeElement({
    id: '40',
    config: {
      list: [
        {
          id: 'EJ_AKTUELLT',
          label: 'Inte aktuellt',
        },
        {
          id: 'ARBETSTRANING',
          label: 'Arbetsträning',
        },
        {
          id: 'ARBETSANPASSNING',
          label: 'Arbetsanpassning',
        },
        {
          id: 'SOKA_NYTT_ARBETE',
          label: 'Söka nytt arbete',
        },
        {
          id: 'BESOK_ARBETSPLATS',
          label: 'Besök på arbetsplatsen',
        },
        {
          id: 'ERGONOMISK',
          label: 'Ergonomisk bedömning',
        },
        {
          id: 'HJALPMEDEL',
          label: 'Hjälpmedel',
        },
        {
          id: 'KONFLIKTHANTERING',
          label: 'Konflikthantering',
        },
        {
          id: 'KONTAKT_FHV',
          label: 'Kontakt med företagshälsovård',
        },
        {
          id: 'OMFORDELNING',
          label: 'Omfördelning av arbetsuppgifter',
        },
        {
          id: 'OVRIGA_ATGARDER',
          label: 'Övrigt',
        },
      ],
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '40',
        expression:
          '$EJ_AKTUELLT || $ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS || $ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
      },
      {
        type: CertificateDataValidationType.DISABLE_VALIDATION,
        questionId: '40',
        expression:
          '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS || $ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
        id: ['EJ_AKTUELLT'],
      },
      {
        type: CertificateDataValidationType.DISABLE_VALIDATION,
        questionId: '40',
        expression: '$EJ_AKTUELLT',
        id: [
          'ARBETSTRANING',
          'ARBETSANPASSNING',
          'SOKA_NYTT_ARBETE',
          'BESOK_ARBETSPLATS',
          'ERGONOMISK',
          'HJALPMEDEL',
          'KONFLIKTHANTERING',
          'KONTAKT_FHV',
          'OMFORDELNING',
          'OVRIGA_ATGARDER',
        ],
      },
    ],
  })['40']

  it('it should validate as true when code is in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'EJ_AKTUELLT', id: 'EJ_AKTUELLT' })
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as false when code is not in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list = []
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true if several codes are chosen', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ERGONOMISK', id: 'ERGONOMISK' })
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ARBETSANPASSNING', id: 'ARBETSANPASSNING' })
    const result = parseExpression(
      '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS || $ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
      codeListElement,
      CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION
    )
    expect(result).toBe(true)
  })
})

describe('Set initial values to a certificate', () => {
  const certificate = fakeCertificate({
    data: {
      ...fakeRadioBooleanElement({
        id: '1.1',
        mandatory: true,
        validation: [
          {
            type: CertificateDataValidationType.MANDATORY_VALIDATION,
            questionId: '1.1',
            expression: '$harFunktionsnedsattning',
          },
          {
            type: CertificateDataValidationType.HIGHLIGHT_VALIDATION,
            questionId: '1.1',
            expression: '$harFunktionsnedsattning',
          },
        ],
      }),
      ...fakeTextFieldElement({
        id: '1.2',
        validation: [
          {
            type: CertificateDataValidationType.MANDATORY_VALIDATION,
            questionId: '1.2',
            expression: '$funktionsnedsattning',
          },
          {
            type: CertificateDataValidationType.SHOW_VALIDATION,
            questionId: '1.1',
            expression: '$harFunktionsnedsattning',
          },
          {
            type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
            questionId: '1.1',
            expression: '$harFunktionsnedsattning',
            fillValue: {
              type: CertificateDataValueType.TEXT,
              id: 'funktionsnedsattning',
              text: 'Detta är autoifyllt!',
            },
          },
        ],
      }),
      ...fakeTextFieldElement({
        id: '1.3',
        validation: [
          {
            type: CertificateDataValidationType.SHOW_VALIDATION,
            questionId: '1.2',
            expression: '$funktionsnedsattning',
          },
          {
            type: CertificateDataValidationType.HIDE_VALIDATION,
            questionId: '1.1',
            expression: '$harFunktionsnedsattning',
          },
          {
            type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
            questionId: '1.1',
            expression: '!$harFunktionsnedsattning',
            fillValue: {
              type: CertificateDataValueType.TEXT,
              id: 'annanFunktionsnedsattning',
              text: 'Detta skall inte autoifyllas eftersom villkoret är falskt!',
            },
          },
        ],
      }),
      ...fakeCheckboxCodeElement({
        id: '28',
        config: {
          list: [
            {
              id: 'NUVARANDE_ARBETE',
              label: 'Nuvarande arbete',
            },
            {
              id: 'ARBETSSOKANDE',
              label: 'Arbetssökande - att utföra sådant arbete som är normalt förekommande på arbetsmarknaden',
            },
            {
              id: 'FORALDRALEDIG',
              label: 'Föräldraledighet för vård av barn',
            },
            {
              id: 'STUDIER',
              label: 'Studier',
            },
          ],
        },
        value: {
          list: [
            {
              code: 'NUVARANDE_ARBETE',
              id: 'NUVARANDE_ARBETE',
            },
          ],
        },
        validation: [
          {
            type: CertificateDataValidationType.MANDATORY_VALIDATION,
            questionId: '28',
            expression: '$NUVARANDE_ARBETE || $ARBETSSOKANDE || $FORALDRALEDIG || $STUDIER',
          },
          {
            type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
            questionId: '28',
            expression: '$NUVARANDE_ARBETE',
            id: ['ARBETSSOKANDE'],
          },
          {
            type: CertificateDataValidationType.DISABLE_SUB_ELEMENT_VALIDATION,
            questionId: '28',
            expression: '$ARBETSSOKANDE',
            id: ['NUVARANDE_ARBETE'],
          },
        ],
      }),
    },
  })

  it('Should set mandatory to true on boolean element if empty', () => {
    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(true)
  })

  it('Should set mandatory to true on boolean element if undefined', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    // Test when selected is undefined when arriving from backend.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    booleanValue.selected = undefined

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(true)
  })

  it('Should set mandatory to false on boolean element if it is true', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(false)
  })

  it('Should set mandatory to false on boolean element if it is false', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].mandatory).toBe(false)
  })

  it('Should set visible to false on boolean element if empty', () => {
    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(false)
  })

  it('Should set visible to false on boolean element if undefined', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    // Test when selected is undefined when arriving from backend.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    booleanValue.selected = undefined

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(false)
  })

  it('Should set visible to true on boolean element if it is true', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(true)
  })

  it('Should set visible to false on boolean element if it is false', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.2'].visible).toBe(false)
  })

  it('Should set visible to false if show rule not valid, even if hide rule is not valid', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.3'].visible).toBe(false)
  })

  it('Should set visible to true if show rule valid, even if hide rule is not valid', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    certificate.data['1.2'].visible = true // Set it visible as default
    certificate.data['1.2'].validation = [] // Clear the validations so they don't affect this test.
    const textValue: ValueText = certificate.data['1.2'].value as ValueText
    textValue.text = 'A little text'

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.3'].visible).toBe(true)
  })

  it('Should set visible to false if hide rule valid, even if show rule is valid', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    const textValue: ValueText = certificate.data['1.2'].value as ValueText
    textValue.text = 'A little text'

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.3'].visible).toBe(false)
  })

  it('Should set highlight if validation is true', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = true

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].style).toBe(CertificateDataElementStyleEnum.HIGHLIGHTED)
  })

  it('Should unstyle element if validation is false', () => {
    const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
    booleanValue.selected = false

    decorateCertificateWithInitialValues(certificate)

    expect(certificate.data['1.1'].style).toBe(CertificateDataElementStyleEnum.NORMAL)
  })

  it('Should disable child element if validation is true', () => {
    decorateCertificateWithInitialValues(certificate)

    expect((certificate.data['28'].config as ConfigUeCheckboxMultipleCodes).list[1].disabled).toBeTruthy()
  })

  it('Should enable child element if validation is false', () => {
    decorateCertificateWithInitialValues(certificate)

    expect((certificate.data['28'].config as ConfigUeCheckboxMultipleCodes).list[0].disabled).toBeFalsy()
  })

  describe('Intialize values for autoFill validation', () => {
    const certificate = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({ id: '1.1', value: { id: 'harFunktionsnedsattning' } }),
        ...fakeTextFieldElement({
          id: '1.2',
          validation: [
            {
              type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
              questionId: '1.1',
              expression: '$harFunktionsnedsattning',
              fillValue: {
                type: CertificateDataValueType.TEXT,
                id: 'funktionsnedsattning',
                text: 'Detta är autoifyllt!',
              },
            },
          ],
        }),
        ...fakeTextFieldElement({
          id: '1.3',
          validation: [
            {
              type: CertificateDataValidationType.AUTO_FILL_VALIDATION,
              questionId: '1.1',
              expression: '!$harFunktionsnedsattning',
              fillValue: {
                type: CertificateDataValueType.TEXT,
                id: 'annanFunktionsnedsattning',
                text: 'Detta skall inte autoifyllas eftersom villkoret är falskt!',
              },
            },
          ],
        }),
      },
    })

    it('Should autoFill value if validation is true', () => {
      const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      decorateCertificateWithInitialValues(certificate)

      expect((certificate.data['1.2'].value as ValueText).text).toBe('Detta är autoifyllt!')
    })

    it('Should not autoFill value if validation is false', () => {
      const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      decorateCertificateWithInitialValues(certificate)

      expect((certificate.data['1.3'].value as ValueText).text).toBe(null)
    })
  })

  describe('Intialize values when certificate is not UNSIGNED', () => {
    const certificate = fakeCertificate({
      data: {
        ...fakeRadioBooleanElement({ id: '1.1' }),
        ...fakeTextFieldElement({ id: '1.2' }),
        ...fakeTextFieldElement({ id: '1.3', visible: false }),
      },
    })

    const clearValues = () => {
      for (const id in certificate.data) {
        certificate.data[id].value = null
        certificate.data[id].readOnly = false
        certificate.data[id].disabled = false
      }
    }

    it('Should set all data elements as disabled when certificate is LOCKED but still validate rules', () => {
      const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      certificate.metadata.status = CertificateStatus.LOCKED

      decorateCertificateWithInitialValues(certificate)

      expect(certificate.data['1.1'].disabled).toBe(true)
      expect(certificate.data['1.1'].visible).toBe(true)
      expect(certificate.data['1.2'].disabled).toBe(true)
      expect(certificate.data['1.2'].visible).toBe(true)
      expect(certificate.data['1.3'].disabled).toBe(true)
      expect(certificate.data['1.3'].visible).toBe(false)
    })

    it('Should set all data elements as disabled when certificate is LOCKED_REVOKED but still validate rules', () => {
      const booleanValue: ValueBoolean = certificate.data['1.1'].value as ValueBoolean
      booleanValue.selected = true

      certificate.metadata.status = CertificateStatus.LOCKED_REVOKED

      decorateCertificateWithInitialValues(certificate)

      expect(certificate.data['1.1'].disabled).toBe(true)
      expect(certificate.data['1.1'].visible).toBe(true)
      expect(certificate.data['1.2'].disabled).toBe(true)
      expect(certificate.data['1.2'].visible).toBe(true)
      expect(certificate.data['1.3'].disabled).toBe(true)
      expect(certificate.data['1.3'].visible).toBe(false)
    })

    it('Should set all data elements as readOnly when certificate is SIGNED', () => {
      clearValues()
      certificate.metadata.status = CertificateStatus.SIGNED

      decorateCertificateWithInitialValues(certificate)

      expect(certificate.data['1.1'].readOnly).toBe(true)
      expect(certificate.data['1.2'].readOnly).toBe(true)
      expect(certificate.data['1.1'].visible).toBe(true)
      expect(certificate.data['1.2'].visible).toBe(true)
    })

    it('Should set all data elements as readOnly when certificate is REVOKED', () => {
      clearValues()
      certificate.metadata.status = CertificateStatus.REVOKED

      decorateCertificateWithInitialValues(certificate)

      expect(certificate.data['1.1'].readOnly).toBe(true)
      expect(certificate.data['1.2'].readOnly).toBe(true)
      expect(certificate.data['1.1'].visible).toBe(true)
      expect(certificate.data['1.2'].visible).toBe(true)
    })
  })

  it('Should return validation errors from field', () => {
    const validationError: ValidationError = { id: '', category: '', field: 'grunddata.skapadAv.vardenhet.postadress', type: '', text: '' }
    const validationErrors: ValidationError[] = []
    validationErrors.push(validationError)

    const result = getValidationErrors(validationErrors, 'grunddata.skapadAv.vardenhet.postadress')

    expect(result.length).toBe(1)
    expect(result[0].field).toBe('grunddata.skapadAv.vardenhet.postadress')
  })

  it('Should return empty array on non existing field', () => {
    const validationError: ValidationError = { id: '', category: '', field: 'grunddata.skapadAv.vardenhet.postadress', type: '', text: '' }
    const validationErrors: ValidationError[] = []
    validationErrors.push(validationError)

    const result = getValidationErrors(validationErrors, 'NON_EXISTING_FIELD')

    expect(result.length).toBe(0)
  })

  it('Should return empty array on non existing field', () => {
    const validationError: ValidationError = { id: '', category: '', field: 'grunddata.patient.postadress', type: '', text: '' }
    const validationErrors: ValidationError[] = []
    validationErrors.push(validationError)

    const result = getValidationErrors(validationErrors, 'NON_EXISTING_FIELD')

    expect(result.length).toBe(0)
  })

  it('Should return validation errors from field', () => {
    const validationError: ValidationError = { id: '', category: '', field: 'grunddata.patient.postadress', type: '', text: '' }
    const validationErrors: ValidationError[] = []
    validationErrors.push(validationError)

    const result = getValidationErrors(validationErrors, 'grunddata.patient.postadress')

    expect(result.length).toBe(1)
    expect(result[0].field).toBe('grunddata.patient.postadress')
  })

  it('Should disable all categories if no edit link', () => {
    const certificate = fakeCertificate()

    decorateCertificateWithInitialValues(certificate)

    Object.values(certificate.data).forEach((data) => {
      expect(data.disabled).toBe(true)
    })
  })

  it('Should not disable all categories if there is an edit link', () => {
    const certificate = fakeCertificate({
      data: {
        ...fakeTextFieldElement({ id: '1.1' }),
        ...fakeCategoryElement({ id: 'category' }),
      },
      links: [
        {
          type: ResourceLinkType.EDIT_CERTIFICATE,
          name: '',
          description: '',
          enabled: false,
        },
      ],
    })

    decorateCertificateWithInitialValues(certificate)

    Object.values(certificate.data).forEach((data) => {
      expect(data.disabled).toBeFalsy()
    })
  })
})

describe('isShowAlways', () => {
  it('Should return true if validation error is of type other', () => {
    const result = isShowAlways(getValidationError('OTHER'))
    expect(result).toBeTruthy()
  })

  it('Should return true if validation error is of type other', () => {
    const result = isShowAlways(getValidationError('INVALID_FORMAT'))
    expect(result).toBeTruthy()
  })

  it('Should return false if validation error is of other type than other or invalid format', () => {
    const result = isShowAlways(getValidationError('TEST'))
    expect(result).toBeFalsy()
  })
})

describe('Validate expressions based on DateValue', () => {
  it('Should return true if date has a value', () => {
    const result = parseExpression(
      '$dodsdatum',
      fakeDateElement({
        id: 'id',
        value: {
          id: 'dodsdatum',
          date: '2022-01-01',
        },
      })['id'],
      CertificateDataValidationType.DISABLE_VALIDATION
    )
    expect(result).toBe(true)
  })

  it('Should return false if date is missing a value', () => {
    const result = parseExpression(
      '$dodsdatum',
      fakeDateElement({
        id: 'id',
        value: {
          id: 'dodsdatum',
          date: undefined,
        },
      })['id'],
      CertificateDataValidationType.DISABLE_VALIDATION
    )
    expect(result).toBe(false)
  })

  it('Should return true if EpochDay is within 28 days', () => {
    const result = parseExpression(
      '$dodsdatum.toEpochDay <= 19013',
      fakeDateElement({
        id: 'id',
        value: {
          id: 'dodsdatum',
          date: '2022-01-01',
        },
      })['id'],
      CertificateDataValidationType.DISABLE_VALIDATION
    )
    expect(result).toBe(true)
  })

  it('Should return false if EpochDay is not within 28 days', () => {
    const result = parseExpression(
      '$dodsdatum.toEpochDay <= 18992',
      fakeDateElement({
        id: 'id',
        value: {
          id: 'dodsdatum',
          date: '2022-01-01', // 18993
        },
      })['id'],
      CertificateDataValidationType.DISABLE_VALIDATION
    )
    expect(result).toBe(false)
  })

  it('Should return false if EpochDay is not set', () => {
    const result = parseExpression(
      '$dodsdatum.toEpochDay > 18992',
      fakeDateElement({
        id: 'id',
        value: {
          id: 'dodsdatum',
          date: undefined,
        },
      })['id'],
      CertificateDataValidationType.SHOW_VALIDATION
    )
    expect(result).toBe(false)
  })
})

describe('Validate expressions only when visible', () => {
  it('Should return true if date has a value and element is visible', () => {
    const result = parseExpression(
      '$dodsdatum',
      fakeDateElement({
        id: 'id',
        value: {
          id: 'dodsdatum',
          date: '2022-01-01',
        },
      })['id'],
      CertificateDataValidationType.DISABLE_VALIDATION
    )
    expect(result).toBe(true)
  })

  it('Should return false if date has a value and element is not visible', () => {
    const result = parseExpression(
      '$dodsdatum',
      fakeDateElement({
        id: 'id',
        visible: false,
        value: {
          id: 'dodsdatum',
          date: '2022-01-01',
        },
      })['id'],
      CertificateDataValidationType.DISABLE_VALIDATION
    )
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
  const element = fakeRadioBooleanElement({ id: 'id' })['id']

  it('Should return true if selected is undefined for negative expression', () => {
    ;(element.value as ValueBoolean).selected = undefined
    const result = parseExpression('!$dodsdatumSakert', element, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(true)
  })
  it('Should return false if selected is undefined for positive expression', () => {
    ;(element.value as ValueBoolean).selected = undefined
    const result = parseExpression('$dodsdatumSakert', element, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })
  it('Should return true if selected is null for negative expression', () => {
    ;(element.value as ValueBoolean).selected = null
    const result = parseExpression('!$dodsdatumSakert', element, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(true)
  })
  it('Should return false if selected is null for positive expression', () => {
    ;(element.value as ValueBoolean).selected = null
    const result = parseExpression('$dodsdatumSakert', element, CertificateDataValidationType.SHOW_VALIDATION)
    expect(result).toBe(false)
  })
})

const getValidationError = (type: string): ValidationError => {
  return {
    id: 'id',
    type: type,
    field: 'field',
    category: 'category',
    text: 'text',
  }
}
