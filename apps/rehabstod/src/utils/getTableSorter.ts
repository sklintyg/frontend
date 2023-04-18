export function getTableSorter(column: string, ascending: boolean) {
  return <T>(list: T[], extractor: <S extends T>(column: string, data: S, list: S[]) => unknown): T[] => {
    const sortedList = [...list].sort((a: T, b: T) => ((extractor(column, a, list) ?? -1) > (extractor(column, b, list) ?? -1) ? 1 : -1))
    return ascending ? sortedList.reverse() : sortedList
  }
}
