import {
  Certificate,
  CertificateDataElement,
  CertificateDataValidationType,
  CertificateDataValueType,
  CertificateStatus,
  ConfigTypes,
  ValueBoolean,
  ValueCodeList,
  ValueText,
} from '..'
import { parseExpression, validateExpressions } from './validationUtils'

describe('Validate mandatory rule for boolean values', () => {
  const booleanElement: CertificateDataElement = {
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
  const textElement: CertificateDataElement = {
    id: '1.2',
    parent: '1.1',
    index: 1,
    visible: true,
    readOnly: false,
    mandatory: true,
    config: {
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      type: ConfigTypes.UE_TEXTAREA,
      id: 'funktionsnedsattning',
    },
    value: {
      type: CertificateDataValueType.TEXT,
      id: 'funktionsnedsattning',
      text: null,
    },
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
    ],
    validationErrors: [],
  }

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
  const booleanElement: CertificateDataElement = {
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
        personId: '191212121212',
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
