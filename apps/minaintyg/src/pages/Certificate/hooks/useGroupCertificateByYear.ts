import { groupBy, sortBy } from '@frontend/utils'
import { getYear, parseISO } from 'date-fns'
import { useMemo } from 'react'
import { SortDirection } from 'react-stately'
import { CertificateMetadata } from '../../../schema/certificate.schema'

export function useGroupCertificateByYear(certificates: CertificateMetadata[], order: SortDirection = 'descending') {
  return useMemo(
    () =>
      Object.entries(groupBy(certificates, ({ issued }: CertificateMetadata) => getYear(parseISO(issued)))).sort(
        sortBy(order, ([year]) => parseInt(year, 10))
      ),
    [certificates, order]
  )
}
