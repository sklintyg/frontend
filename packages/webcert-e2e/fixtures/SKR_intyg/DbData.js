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

  polisanmälan: {
    finnsSkälFörPolisanmälan: {
      'Ja, om dödsfallet har eller kan ha orsakats av yttre påverkan (skada/förgiftning) eller fel/försummelse i vården eller den dödes identitet är okänd, ska polisanmälan göras och dödsbeviset lämnas till Polismyndigheten': true,
    },
  },
}
