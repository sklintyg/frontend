import { ErrorAlert } from '../ErrorAlert/ErrorAlert'
import { getTableErrorDescription, getTableErrorTitle } from '../../Table/filter/utils/tableTextGeneratorUtils'

export function GetTableContentError({ tableName }: { tableName: string }) {
  return <ErrorAlert heading={getTableErrorTitle(tableName)} errorType="error" text={getTableErrorDescription(tableName)} dynamicLink />
}
