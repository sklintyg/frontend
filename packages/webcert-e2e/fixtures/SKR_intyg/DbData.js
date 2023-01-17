db = {
  kompletterandePatientuppgifter: {
    identietenStyrktGenom: {
      text: 'Körkort',
    },
  },

  dödsdatumOchDödsplats: {
    säkert: true,
    datum: '2022-11-01',
    Kommun: 'Kil',
    boendeDärKroppenPåträffades: {
      Sjukhus: true,
    },
  },

  explosivtImplantat: {
    'HarDenAvlidneHaftEttImplantatSomKanExploderaVidKremering?': {
      Ja: true,
    },
    'harImplantatetAvlägsnats?': {
      Ja: true,
    },
  },

  utlåtandeOmDödsorsaken: {
    beskrivning: 'Infektion',
    datum: '2021-11-01',
  },

  polisanmälan: {
    finnsSkälFörPolisanmälan: {
      Ja: true,
    },
  },
}
