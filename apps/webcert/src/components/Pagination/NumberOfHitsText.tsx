interface Props {
  totalPages: number
  page: number
  startFrom: number
  totalCount: number
  pageSize: number
}

const NumberOfHitsText: React.FC<Props> = ({ totalPages, page, startFrom, totalCount, pageSize }) => {
  const getNumberOfHitsText = () => {
    const isLastPage = totalPages === page
    const start = startFrom + 1
    const end = !isLastPage ? startFrom + pageSize : totalCount
    return totalPages > 1 ? (
      <p>
        Visar {start} - {end} av {totalCount} träffar
      </p>
    ) : (
      <p>
        Visar {end} av {end} träffar
      </p>
    )
  }

  return getNumberOfHitsText()
}

export default NumberOfHitsText
