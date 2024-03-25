import { ResourceLink, ResourceLinkType, UserStatistics, UserTab } from '../types'

export const getUserTabs = (isCareAdmin: boolean, userStatistics: UserStatistics | undefined, links: ResourceLink[]): UserTab[] => {
  if (isCareAdmin) {
    return getTabsForAdministrator(userStatistics, links)
  }
  return getTabs(userStatistics, links)
}

const getTabs = (statistics: UserStatistics | undefined, links: ResourceLink[]) => {
  const tabs: UserTab[] = []

  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, getSearchCreateTab)
  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_UNHANDLED_CERTIFICATES, getUnhandledCertificatesListTab)
  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_DRAFT_LIST, getDraftListTab)
  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST, getCertificateListTab)

  return tabs
}

const addTabIfAccessToPage = (
  tabs: UserTab[],
  statistics: UserStatistics | undefined,
  links: ResourceLink[],
  type: ResourceLinkType,
  getTab: (link: ResourceLink, statistics?: UserStatistics) => UserTab
) => {
  const link = getLink(links, type)
  if (link) {
    tabs.push(getTab(link, statistics))
  }
}

const getTabsForAdministrator = (statistics: UserStatistics | undefined, links: ResourceLink[]) => {
  const tabs: UserTab[] = []

  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_UNHANDLED_CERTIFICATES, getUnhandledCertificatesListTab)
  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_DRAFT_LIST, getDraftListTab)
  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST, getCertificateListTab)
  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, getSearchCreateTab)

  return tabs
}

const getLink = (links: ResourceLink[], linkType: ResourceLinkType) => {
  return links.find((link) => link.type === linkType)
}

const getSearchCreateTab = (link: ResourceLink): UserTab => {
  return {
    title: link.name,
    url: '/search',
    matchedUrls: ['/certificate'],
  }
}

const getDraftListTab = (link: ResourceLink, statistics: UserStatistics | undefined): UserTab => {
  return {
    number: statistics ? statistics.nbrOfDraftsOnSelectedUnit : undefined,
    title: link.name,
    url: '/list/draft',
    matchedUrls: [],
  }
}

const getUnhandledCertificatesListTab = (link: ResourceLink, statistics: UserStatistics | undefined): UserTab => {
  return {
    number: statistics ? statistics.nbrOfUnhandledQuestionsOnSelectedUnit : undefined,
    title: link.name,
    url: '/list/unhandledcertificates',
    matchedUrls: [],
  }
}

const getCertificateListTab = (link: ResourceLink): UserTab => {
  return {
    title: link.name,
    url: '/list/certificate',
    matchedUrls: [],
  }
}
