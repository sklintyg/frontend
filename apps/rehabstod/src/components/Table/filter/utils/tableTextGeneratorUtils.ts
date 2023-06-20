import { isUserDoctor } from '../../../../utils/isUserDoctor'
import { User } from '../../../../schemas'

export const getSearchText = ({ isDoctor, tableName, suffix }: { isDoctor: boolean; tableName: string; suffix: string }) =>
  `Tryck på Sök för att visa ${
    isDoctor ? 'alla dina' : 'alla'
  }  ${tableName} för enheten, eller ange filterval och tryck på Sök för att visa urval av ${tableName}. ${suffix ? `\n${suffix}` : ''}`

export const getEmptyTableText = ({ user, tableName }: { user: User; tableName: string }) =>
  `${isUserDoctor(user) ? 'Du har' : 'Det finns'} inga ${tableName} på ${user && user.valdVardenhet ? user.valdVardenhet.namn : ''} .`

export const getEmptyFiltrationText = ({ tableName }: { tableName: string }) => `Inga ${tableName} matchade filtreringen.`

export const getTableErrorTitle = ({ tableName }: { tableName: string }) =>
  `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} för enheten kunde inte hämtas.`

export const getTableErrorDescription = ({ tableName }: { tableName: string }) =>
  `Enhetens ${tableName} kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand `
