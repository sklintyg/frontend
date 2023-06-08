export enum ErrorCode {
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_HSA_ERROR = 'LOGIN_HSA_ERROR',
  LOGIN_MEDARBETARUPPDRAG_SAKNAS = 'LOGIN_MEDARBETARUPPDRAG_SAKNAS',
  LOGIN_SAKNAR_HSA_REHABROLL = 'LOGIN_SAKNAR_HSA_REHABROLL',
}

export enum ErrorTitle {
  LOGIN_FAILED = 'Inloggning misslyckades',
  LOGIN_HSA_ERROR = 'Tekniskt fel',
  LOGIN_MEDARBETARUPPDRAG_SAKNAS = 'Medarbetaruppdrag saknas',
  LOGIN_SAKNAR_HSA_REHABROLL = 'Behörighet saknas',
}

export enum ErrorText {
  LOGIN_FAILED = 'Inloggningen misslyckades. Gå tillbaka till startsidan',
  LOGIN_HSA_ERROR = 'Tyvärr har ett tekniskt problem uppstått i Rehabstöd. Försök gärna igen för att se om felet är tillfälligt. Kontakta annars i första hand din lokala IT-avdelning och i andra hand ',
  LOGIN_MEDARBETARUPPDRAG_SAKNAS = 'Det krävs minst ett giltigt medarbetaruppdrag med ändamål "Vård och behandling" för att använda Rehabstöd.',
  LOGIN_SAKNAR_HSA_REHABROLL = 'För att logga in som Rehabkoordinator krävs att du har den rollen för enheten i HSA',
}
