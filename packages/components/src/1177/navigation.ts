const data = {
  version: '1.2.0',
  menu: {
    items: [
      {
        id: 1,
        name: 'Start',
        url: {
          prod: 'https://e-tjanster.1177.se/mvk/',
          acc: 'https://e-tjanster.at.1177.se/mvk/',
          sys: 'https://e-tjanster.st.1177.se/mvk/start.xhtml',
        },
        isAgentModeSupported: true,
      },
      {
        id: 2,
        name: 'Inkorg',
        url: {
          prod: 'https://e-tjanster.1177.se/mvk/messageList.xhtml',
          acc: 'https://e-tjanster.at.1177.se/mvk/messageList.xhtml',
          sys: 'https://e-tjanster.st.1177.se/mvk/messageList.xhtml',
        },
        isAgentModeSupported: true,
      },
      {
        id: 3,
        name: 'Bokade tider',
        url: {
          prod: 'https://bokadetider.1177.se/',
          acc: 'https://bokadetider.at.1177.se/',
          sys: 'https://bokadetider.st.1177.se/',
        },
        isAgentModeSupported: true,
      },
      {
        id: 5,
        name: 'Journalen',
        url: {
          prod: 'https://journalen.1177.se/',
          acc: 'https://qa.journalen.inera.se/',
          sys: 'https://sit.journalen.inera.se/',
        },
        isAgentModeSupported: false,
      },
      {
        id: 4,
        name: 'Egen provhantering',
        url: {
          prod: 'https://pep.1177.se/',
          acc: 'https://at-pep.1177.se/',
          sys: 'https://pep.omniq.se/PEP.Resident/context/',
        },
        isAgentModeSupported: true,
      },
      {
        id: 6,
        name: 'Stöd och behandling',
        url: {
          prod: 'https://sob.1177.se/',
          acc: 'https://at.sob.1177.se/',
          sys: 'https://st.sob.1177.se/',
        },
        isAgentModeSupported: true,
      },
      {
        id: 7,
        name: 'Intyg',
        url: {
          prod: '/intyg',
          acc: '/intyg',
          sys: '/intyg',
        },
        isAgentModeSupported: true,
      },
      {
        id: 8,
        name: 'Övriga tjänster',
        url: {
          prod: 'https://e-tjanster.1177.se/mvk/services.xhtml?tab=3',
          acc: 'https://e-tjanster.at.1177.se/mvk/services.xhtml?tab=3',
          sys: 'https://e-tjanster.st.1177.se/mvk/services.xhtml?tab=3',
        },
        isAgentModeSupported: true,
      },
    ],
  },
} as const

export const settingsLink = {
  name: 'Inställningar',
  url: {
    prod: 'https://e-tjanster.1177.se/mvk/settings.xhtml',
    acc: 'https://e-tjanster.at.1177.se/mvk/settings.xhtml',
    sys: 'https://e-tjanster.st.1177.se/mvk/settings.xhtml',
  },
} as const

export type NavigationMenuItem = (typeof data)['menu']['items'][number]

export function getNavigation() {
  return data.menu.items
}

export function getNavigationItem(name: NavigationMenuItem['name']) {
  return getNavigation().find((link) => link.name === name)
}

function getKeyFromMode(mode: string) {
  switch (mode) {
    case 'development':
      return 'sys'
    case 'staging':
      return 'acc'
    default:
      return 'prod'
  }
}

export function getNavigationItemUrl(item: NavigationMenuItem, mode: string) {
  return item.url[getKeyFromMode(mode)]
}

export function getSettingsUrl(mode: string) {
  return settingsLink.url[getKeyFromMode(mode)]
}
