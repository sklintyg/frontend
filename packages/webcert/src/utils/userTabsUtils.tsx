import { ResourceLink, ResourceLinkType, UserStatistics, UserTab } from '@frontend/common'

export const getUserTabs = (isDoctor: boolean, userStatistics: UserStatistics | undefined, links: ResourceLink[]) => {
  if (isDoctor) {
    return getTabsForDoctor(userStatistics, links)
  } else {
    return getTabsForAdministrator(userStatistics, links)
  }
}

const getTabsForDoctor = (statistics: UserStatistics | undefined, links: ResourceLink[]) => {
  const tabs = []
  if (hasLink(links, ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE)) {
    tabs.push(getSearchCreateTab())
  }

  if (hasLink(links, ResourceLinkType.ACCESS_DRAFT_LIST)) {
    tabs.push(getDraftListTab(statistics))
  }

  if (hasLink(links, ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST)) {
    tabs.push(getCertificateListTab())
  }

  return tabs
}

const getTabsForAdministrator = (statistics: UserStatistics | undefined, links: ResourceLink[]) => {
  const tabs = []

  if (hasLink(links, ResourceLinkType.ACCESS_DRAFT_LIST)) {
    tabs.push(getDraftListTab(statistics))
  }

  if (hasLink(links, ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST)) {
    tabs.push(getCertificateListTab())
  }

  if (hasLink(links, ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE)) {
    tabs.push(getSearchCreateTab())
  }

  return tabs
}

const hasLink = (links: ResourceLink[], linkType: ResourceLinkType) => {
  return links.some((link) => link.type === linkType)
}

const getSearchCreateTab = (): UserTab => {
  return {
    title: 'Sök/Skriv intyg',
    url: '/create',
    matchedUrls: ['/certificate'],
  }
}

const getDraftListTab = (statistics: UserStatistics | undefined): UserTab => {
  return {
    number: statistics ? statistics.nbrOfDraftsOnSelectedUnit : undefined,
    title: 'Ej signerade utkast',
    url: '/list/draft',
    matchedUrls: [],
  }
}

const getCertificateListTab = (): UserTab => {
  return {
    title: 'Signerade intyg',
    url: '/list/certificate',
    matchedUrls: [],
  }
}
