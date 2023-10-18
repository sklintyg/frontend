import { sortBy } from '@frontend/utils'
import { getYear, parseISO } from 'date-fns'
import { useMemo } from 'react'
import { SortDirection } from 'react-stately'
import { CertificateListItem } from '../../../schema/certificateList.schema'

const getCertificateYear = ({ issued }: CertificateListItem) => getYear(parseISO(issued))

export function useGroupCertificateByYear(certificates: CertificateListItem[], order: SortDirection = 'descending') {
  return useMemo(() => {
    // Could be replaced with Object.groupBy in the future (currently experimental)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy#browser_compatibility
    const groupByYear = [...certificates]
      .sort(sortBy(order, ({ issued }) => new Date(issued).getTime()))
      .reduce<Record<string, CertificateListItem[]>>((result, certificate) => {
        const year = getCertificateYear(certificate)
        return { ...result, [year]: [...(result[year] ?? []), certificate] }
      }, {})

    return Object.entries(groupByYear).sort(sortBy(order, ([year]) => parseInt(year, 10)))
  }, [certificates, order])
}
