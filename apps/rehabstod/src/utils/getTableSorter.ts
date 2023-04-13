export function getTableSorter(column: string, ascending: boolean) {
  return <T>(list: T[], extractor: <S extends T>(column: string, data: S, list: S[]) => unknown) => {
    const sorter = (a: T, b: T) => ((extractor(column, a, list) ?? -1) > (extractor(column, b, list) ?? -1) ? 1 : -1)
    return ascending ? [...list].sort(sorter).reverse() : [...list].sort(sorter)
  }
}
