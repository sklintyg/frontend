import { isUserDoctor } from '../../../utils/isUserDoctor'
import { User } from '../../../schemas'

export const getSearchText = (isDoctor: boolean, tableName: string, suffix?: string) =>
  `Tryck på Sök för att visa ${
    isDoctor ? 'alla dina' : 'alla'
  } ${tableName} för enheten, eller ange filterval och tryck på Sök för att visa urval av ${tableName}.${suffix ? `\n${suffix}` : ''}`

export const getEmptyTableText = (user: User | undefined, tableName: string) => {
  if (!user) {
    return ''
  }
  return `${isUserDoctor(user) ? 'Du har' : 'Det finns'} inga ${tableName} på ${user && user.valdVardenhet ? user.valdVardenhet.namn : ''}.`
}

export const getEmptyFiltrationText = (tableName: string) => `Inga ${tableName} matchade filtreringen.`
