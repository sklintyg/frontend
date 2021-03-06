import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigTypes,
  ValueBoolean,
  ValueCode,
  ValueCodeList,
  ValueDateList,
  ValueText,
} from '..'
import { decorateCertificateWithInitialValues, parseExpression, validateExpressions } from './validationUtils'
import { getBoooleanElement, getCertificate, getTextElement } from './test/certificateTestUtil'

describe('Validate mandatory rule for boolean values', () => {
  const booleanElement = getBoooleanElement()

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
  const textElement = getTextElement()

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

describe('Validate show rule for boolean values', () => {
  const booleanElement = getBoooleanElement()

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
    const value = dateListElement.value as ValueDateList
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
        type: CertificateDataValidationType.DISABLE_VALIDATION,
        questionId: '40',
        expression:
          '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
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
    validationErrors: [],
  }

  it('it should validate as true when code is in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'EJ_AKTUELLT', id: 'EJ_AKTUELLT' })
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as false when code is not in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list = []
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true if several codes are chosen', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ERGONOMISK', id: 'ERGONOMISK' })
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ARBETSANPASSNING', id: 'ARBETSANPASSNING' })
    const result = parseExpression(
      '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
      codeListElement,
      CertificateDataValidationType.DISABLE_VALIDATION
    )
    expect(result).toBe(true)
  })
})

describe('Validate multiple show rules', () => {
  const categoryElement: CertificateDataElement = {
    id: 'aktivitetsbegransning',
    parent: '',
    index: 3,
    visible: false,
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
    visible: false,
    readOnly: false,
    mandatory: true,
    config: {
      text: 'Leder funktionsnedsättningarna till aktivitetsbegränsningar i relation till arbete eller studier?',
      description:
        'Aktivitet innebär personens möjlighet att genomföra en uppgift eller handling. Aktivitetsbegränsning ska bedömas utifrån de begränsningar personen har kopplat till att kunna söka arbete, genomföra en arbetsuppgift/arbetsuppgifter, kunna studera eller delta i aktivitet hos Arbetsförmedlingen.',
      type: ConfigTypes.UE_RADIO_BOOLEAN,
      id: 'harAktivitetsbegransning',
      selectedText: 'Ja',
      unselectedText: 'Nej',
    },
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
    visible: false,
    readOnly: false,
    mandatory: true,
    config: {
      text: 'Ange vilka aktivitetsbegränsningar? Ange hur och om möjligt varaktighet/prognos.',
      description:
        'Ge konkreta exempel på aktivitetsbegränsningar utifrån personens planerade insatser hos Arbetsförmedlingen eller personens möjlighet att söka arbete, genomföra en arbetsuppgift/arbetsuppgifter eller studera. Till exempel:\n\natt ta till sig en instruktion\natt ta reda på och förstå muntlig eller skriftlig information\natt kunna fokusera\natt kunna bära eller lyfta\natt kunna hantera statiskt arbete',
      type: ConfigTypes.UE_TEXTAREA,
      id: 'aktivitetsbegransning',
    },
    value: {
      type: CertificateDataValueType.TEXT,
      id: 'aktivitetsbegransning',
      text: null,
    },
    validation: [
      {
        type: CertificateDataValidationType.MANDATORY_VALIDATION,
        questionId: '1.2',
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
    config: {
      text: 'Finns besvär på grund av sjukdom eller skada som medför funktionsnedsättning?',
      description: 'Med besvär avses sådant som påverkar psykiska, psykosociala eller kroppsliga funktioner.',
      type: ConfigTypes.UE_RADIO_BOOLEAN,
      id: 'harFunktionsnedsattning',
      selectedText: 'Ja',
      unselectedText: 'Nej',
    },
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
      },
      careProvider: {
        unitId: 'TSTNMT2321000156-102Q',
        unitName: 'NMT vg3',
        address: 'NMT gata 3',
        zipCode: '12345',
        city: 'Testhult',
        phoneNumber: '0101112131416',
        email: 'enhet3@webcert.invalid.se',
      },
      patient: {
        personId: {
          id: '191212121212',
          type: 'Personnummer',
        },
        firstName: 'Tolvan',
        lastName: 'Tolvansson',
        fullName: 'Tolvan Tolvansson',
        coordinationNumber: false,
        testIndicated: false,
        protectedPerson: false,
        deceased: false,
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

  it('It should validate as false if only one show rule is true', () => {
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
    expect(textResult === undefined ? undefined : textResult.result).toBe(false)
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
    value: {
      type: CertificateDataValueType.CODE,
    },
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
    const result = parseExpression('$ATER_X_ANTAL_DGR', codeElement, CertificateDataValidationType.ENABLE_VALIDATION)
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
        type: CertificateDataValidationType.DISABLE_VALIDATION,
        questionId: '40',
        expression:
          '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
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
    validationErrors: [],
  }

  it('it should validate as true when code is in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'EJ_AKTUELLT', id: 'EJ_AKTUELLT' })
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_VALIDATION)
    expect(result).toBe(true)
  })

  it('it should validate as false when code is not in list', () => {
    const value = codeListElement.value as ValueCodeList
    value.list = []
    const result = parseExpression('$EJ_AKTUELLT', codeListElement, CertificateDataValidationType.DISABLE_VALIDATION)
    expect(result).toBe(false)
  })

  it('it should validate as true if several codes are chosen', () => {
    const value = codeListElement.value as ValueCodeList
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ERGONOMISK', id: 'ERGONOMISK' })
    value.list.push({ type: CertificateDataValueType.CODE, code: 'ARBETSANPASSNING', id: 'ARBETSANPASSNING' })
    const result = parseExpression(
      '$ARBETSTRANING || $ARBETSANPASSNING || $SOKA_NYTT_ARBETE || $BESOK_ARBETSPLATS ||$ERGONOMISK || $HJALPMEDEL || $KONFLIKTHANTERING || $KONTAKT_FHV || $OMFORDELNING || $OVRIGA_ATGARDER',
      codeListElement,
      CertificateDataValidationType.DISABLE_VALIDATION
    )
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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

  describe('Intialize values when certificate is not UNSIGNED', () => {
    const certificate = getCertificate()

    const clearValues = () => {
      for (const id in certificate.data) {
        certificate.data[id].value = null
        certificate.data[id].visible = false
        certificate.data[id].readOnly = false
        certificate.data[id].disabled = false
      }
    }

    it('Shall set all data elements as disabled when certificate is LOCKED but still validate rules', () => {
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

    it('Shall set all data elements as disabled when certificate is LOCKED_REVOKED but still validate rules', () => {
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

    it('Shall set all data elements as readOnly when certificate is SIGNED', () => {
      clearValues()
      certificate.metadata.status = CertificateStatus.SIGNED

      decorateCertificateWithInitialValues(certificate)

      expect(certificate.data['1.1'].readOnly).toBe(true)
      expect(certificate.data['1.2'].readOnly).toBe(true)
      expect(certificate.data['1.1'].visible).toBe(true)
      expect(certificate.data['1.2'].visible).toBe(true)
    })

    it('Shall set all data elements as readOnly when certificate is REVOKED', () => {
      clearValues()
      certificate.metadata.status = CertificateStatus.REVOKED

      decorateCertificateWithInitialValues(certificate)

      expect(certificate.data['1.1'].readOnly).toBe(true)
      expect(certificate.data['1.2'].readOnly).toBe(true)
      expect(certificate.data['1.1'].visible).toBe(true)
      expect(certificate.data['1.2'].visible).toBe(true)
    })
  })
})
