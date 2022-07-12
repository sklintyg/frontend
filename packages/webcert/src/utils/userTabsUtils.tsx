import { ResourceLink, ResourceLinkType, UserStatistics, UserTab } from '@frontend/common'

export const getUserTabs = (isDoctor: boolean, userStatistics: UserStatistics | undefined, links: ResourceLink[]) => {
  if (isDoctor) {
    return getTabsForDoctor(userStatistics, links)
  } else {
    return getTabsForAdministrator(userStatistics, links)
  }
}

const getTabsForDoctor = (statistics: UserStatistics | undefined, links: ResourceLink[]) => {
  const tabs: UserTab[] = []

  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE, getSearchCreateTab)
  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_QUESTION_LIST, getQuestionListTab)
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

  addTabIfAccessToPage(tabs, statistics, links, ResourceLinkType.ACCESS_QUESTION_LIST, getQuestionListTab)
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
    url: '/create',
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

const getQuestionListTab = (link: ResourceLink, statistics: UserStatistics | undefined): UserTab => {
  return {
    number: statistics ? statistics.nbrOfUnhandledQuestionsOnSelectedUnit : undefined,
    title: link.name,
    url: '/list/question',
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
